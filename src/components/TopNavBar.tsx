import { ArrowLeft, Printer } from 'lucide-react';
import { MenuSectionId } from '../types/resume';

interface TopNavBarProps {
  brandName: string;
  activeTab: MenuSectionId;
  onSelectTab: (tab: MenuSectionId) => void;
  onBackToTitle: () => void;
  onPrint: () => void;
}

export const MENU_TABS: { id: MenuSectionId; label: string }[] = [
  { id: 'adventure', label: 'Overview' },
  { id: 'skills', label: 'Skill Tree' },
  { id: 'portfolio', label: 'Portfolio' },
];

export function TopNavBar({
  brandName,
  activeTab,
  onSelectTab,
  onBackToTitle,
  onPrint,
}: TopNavBarProps) {
  return (
    <header className="relative z-10 w-full border-b border-[#4CE4FF]/20 bg-[#08111A]/85 backdrop-blur-md print:hidden">
      <div className="max-w-[1360px] mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={onBackToTitle}
          className="inline-flex items-center gap-2 font-display italic text-xl font-semibold tracking-wide text-[#F3E3B4] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] rounded-sm px-1"
          title="Return to Main Screen"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5C97B]/80" aria-hidden="true" />
          <span>{brandName}</span>
        </button>

        {/* Zone 2: Sub-Page Navigation Links Only (No Hero's Path or Contact) */}
        <nav
          aria-label="Resume Menu Sections"
          className="hidden md:flex items-center gap-6"
        >
          {MENU_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF] rounded-sm ${
                  isActive
                    ? 'text-[#F3E3B4]'
                    : 'text-[#FAF6EC]/68 hover:text-[#FAF6EC]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-[15px] h-[2px] bg-[#4CE4FF] shadow-[0_0_8px_rgba(76,228,255,0.75)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Print Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-[#0B0E12] bg-[#E5C97B] hover:bg-[#F3E3B4] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CE4FF]"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print Resume</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto px-4 pb-3 pt-1 border-t border-[#FAF6EC]/10">
        {MENU_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium rounded-sm whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#4CE4FF]/15 text-[#9AF0FF] border border-[#4CE4FF]/55'
                  : 'text-[#FAF6EC]/70 hover:text-[#FAF6EC]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
