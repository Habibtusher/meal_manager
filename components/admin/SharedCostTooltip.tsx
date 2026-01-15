'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatCurrency } from '@/lib/utils';

interface SharedCostDetail {
    description: string;
    category: string;
    amount: number;
    date: Date;
}

interface SharedCostTooltipProps {
    totalAmount: number;
    details: SharedCostDetail[];
}

export default function SharedCostTooltip({ totalAmount, details }: SharedCostTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position above the trigger, centered
            setPosition({
                top: rect.top - 8, // 8px gap
                left: rect.left + rect.width / 2
            });
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    // Handle scroll to hide tooltip (optional, but good for fixed pos)
    useEffect(() => {
        const handleScroll = () => {
            if (isVisible) setIsVisible(false);
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isVisible]);

    return (
        <>
            <span
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="cursor-help border-b border-dashed border-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors inline-block"
            >
                {formatCurrency(totalAmount)}
            </span>

            {isVisible && details.length > 0 && createPortal(
                <div
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        top: position.top,
                        left: position.left,
                        transform: 'translate(-50%, -100%)' // Move up and center
                    }}
                >
                    <div className="w-72 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
                        {/* Down Arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>

                        <div className="font-bold mb-2 pb-2 border-b border-gray-700 text-sm">Shared Cost Breakdown</div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                            {details.map((detail, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-3 py-1">
                                    <span className="text-gray-300 text-left flex-1">{detail.description}</span>
                                    <span className="font-semibold text-white whitespace-nowrap">{formatCurrency(detail.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
