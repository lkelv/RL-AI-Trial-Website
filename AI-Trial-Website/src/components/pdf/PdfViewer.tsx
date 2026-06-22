import { IconDownload, IconExternal, IconFile } from "../ui/Icons";

interface PdfViewerProps {
  href: string;
  downloadName: string;
  label: string;
  className?: string;
}

export function PdfViewer({ href, downloadName, label, className = "" }: PdfViewerProps) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border border-line/70 bg-base/60 ${className}`}>
      <div className="flex items-center gap-2 border-b border-line/70 bg-raised/50 px-3 py-2">
        <IconFile size={16} className="text-mint" />
        <span className="truncate text-sm font-medium text-ink">{label}</span>
        <div className="ml-auto flex items-center gap-1">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            title="Open in new tab"
            className="inline-flex items-center gap-1 rounded-md border border-line bg-base/60 px-2 py-1 text-xs text-ink-dim transition-colors hover:border-mint/50 hover:text-ink"
          >
            <IconExternal size={13} /> Open
          </a>
          <a
            href={href}
            download={downloadName}
            title="Download PDF"
            className="inline-flex items-center gap-1 rounded-md bg-mint px-2 py-1 text-xs font-semibold text-night transition-colors hover:bg-mint-soft"
          >
            <IconDownload size={13} /> Download
          </a>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 bg-[#525659]">
        <iframe
          src={`${href}#toolbar=0&navpanes=0&view=FitH`}
          title={label}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
