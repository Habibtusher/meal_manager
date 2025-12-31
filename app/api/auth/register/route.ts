import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const registerSchema = z.object({
  // Organization details
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  organizationType: z.enum(['mess', 'hostel', 'restaurant']).default('mess'),
  organizationDescription: z.string().optional(),
  
  // Admin user details
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create organization and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: validatedData.organizationName,
          type: validatedData.organizationType,
          description: validatedData.organizationDescription,
        },
      });

      // Create admin user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: 'ADMIN',
          organizationId: organization.id,
          emailVerified: new Date(), // Auto-verify for now
        },
      });

      return { organization, user };
    });

    // Return success (excluding password)
    return NextResponse.json({
      success: true,
      message: 'Organization and admin account created successfully',
      data: {
        organizationId: result.organization.id,
        userId: result.user.id,
        email: result.user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
