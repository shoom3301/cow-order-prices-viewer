import "./index.css";
import type { QuoteAmountsAndCosts, QuoteAmountsAndCostsParams } from "@cowprotocol/cow-sdk";
import { quoteAmountsAndCostsBreakdown } from "../../logic/quoteAmountsAndCostsBreakdown.ts";
import { useState } from "react";

interface AmountsExplanationProps {
    params: QuoteAmountsAndCostsParams
    amountsAndCosts: QuoteAmountsAndCosts
}

interface BreakdownSection {
    title: string
    lines: string[]
}

export function AmountsExplanation({params, amountsAndCosts}: AmountsExplanationProps) {
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0])) // First section expanded by default
    const breakdownText = quoteAmountsAndCostsBreakdown(params, amountsAndCosts)
    const { orderKind, sections } = parseBreakdown(breakdownText)

    const toggleSection = (index: number) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(index)) {
            newExpanded.delete(index)
        } else {
            newExpanded.add(index)
        }
        setExpandedSections(newExpanded)
    }

    const expandAll = () => {
        setExpandedSections(new Set(sections.map((_, i) => i)))
    }

    const collapseAll = () => {
        setExpandedSections(new Set())
    }

    return (
        <div className="amounts-explanation">
            <div className="amounts-explanation-header">
                <h3>Details <strong>[AI GENERATED]</strong> <span className={`order-kind-badge ${orderKind.toLowerCase()}`}>{orderKind}</span></h3>
                <div className="amounts-explanation-controls">
                    <button onClick={expandAll} className="control-button">Expand All</button>
                    <button onClick={collapseAll} className="control-button">Collapse All</button>
                </div>
            </div>

            <div className="amounts-explanation-sections">
                {sections.map((section, index) => {
                    const isExpanded = expandedSections.has(index)
                    const isSummary = section.title.includes('SUMMARY')

                    return (
                        <div key={index} className={`breakdown-section ${isSummary ? 'summary-section' : ''}`}>
                            <button
                                className="breakdown-section-toggle"
                                onClick={() => toggleSection(index)}
                                aria-expanded={isExpanded}
                            >
                                <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
                                <span className="section-title">{section.title}</span>
                            </button>

                            {isExpanded && (
                                <div className="breakdown-section-content">
                                    {section.lines.map((line, lineIndex) => {
                                        const trimmedLine = line.trim()
                                        if (!trimmedLine) return null

                                        // Detect line type for styling
                                        const isFormula = trimmedLine.includes('Formula:')
                                        const isResult = trimmedLine.includes('=>')
                                        const isCalculation = trimmedLine.includes('=') && !isFormula && !isResult
                                        const isComment = trimmedLine.startsWith('For ') || trimmedLine.startsWith('Protocol fee')
                                        const isIndented = line.startsWith('  ')

                                        let className = 'breakdown-line'
                                        if (isFormula) className += ' formula-line'
                                        if (isResult) className += ' result-line'
                                        if (isCalculation) className += ' calculation-line'
                                        if (isComment) className += ' comment-line'
                                        if (isIndented) className += ' indented-line'

                                        return (
                                            <div key={lineIndex} className={className}>
                                                {trimmedLine}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function parseBreakdown(text: string): { orderKind: string, sections: BreakdownSection[] } {
    const lines = text.split('\n')
    const sections: BreakdownSection[] = []
    let currentSection: BreakdownSection | null = null
    let orderKind = 'UNKNOWN'

    for (const line of lines) {
        // Skip separator lines
        if (line.match(/^=+$/) || line.trim() === '') {
            continue
        }

        // Detect order kind
        if (line.includes('Order Kind:')) {
            orderKind = line.includes('SELL') ? 'SELL' : 'BUY'
        }

        // Check if this is a section header (all caps or starts with STEP)
        if (line.match(/^[A-Z][A-Z\s:]+$/) || line.match(/^STEP \d+:/)) {
            if (currentSection) {
                sections.push(currentSection)
            }
            currentSection = {
                title: line.trim(),
                lines: []
            }
        } else if (line.match(/^-+$/)) {
            // Skip separator lines within sections
            continue
        } else if (currentSection) {
            currentSection.lines.push(line)
        }
    }

    if (currentSection) {
        sections.push(currentSection)
    }

    return { orderKind, sections }
}
