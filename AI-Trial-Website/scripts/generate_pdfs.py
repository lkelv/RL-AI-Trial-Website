"""
Generate the three premade demo PDFs used by the RL AI Tutoring site:
  public/pdfs/practice-questions.pdf
  public/pdfs/practice-solutions.pdf
  public/pdfs/ai-marked-sample.pdf

These are placeholders for the live demo (MM34 · Differentiation · Exam 1).
Swap them for real RL papers by replacing the files in public/pdfs.

Run:  python3 scripts/generate_pdfs.py
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable,
)

SLATE = colors.HexColor("#202830")
MINT = colors.HexColor("#74be9c")
INK = colors.HexColor("#1b232b")
GREY = colors.HexColor("#5b6b66")
SOLC = colors.HexColor("#33414a")
GREEN = "#2e7d32"
RED = "#c0392b"
NAVY = "#274690"

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "pdfs")
os.makedirs(OUT, exist_ok=True)

W, H = A4
CONTENT_W = W - 80

styles = getSampleStyleSheet()
S_TITLE = ParagraphStyle("t", fontName="Helvetica-Bold", fontSize=15, textColor=INK, spaceAfter=3)
S_SUB = ParagraphStyle("s", fontName="Helvetica", fontSize=10.5, textColor=GREY, spaceAfter=3)
S_INSTR = ParagraphStyle("i", fontName="Helvetica-Oblique", fontSize=9, textColor=GREY, spaceAfter=4)
S_Q = ParagraphStyle("q", fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK)
S_MARKS = ParagraphStyle("m", fontName="Helvetica", fontSize=9.5, textColor=GREY, alignment=TA_RIGHT)
S_SOL = ParagraphStyle("sol", fontName="Helvetica", fontSize=10, leading=14.5, textColor=SOLC, leftIndent=16, spaceBefore=2)
S_SCORE = ParagraphStyle("score", fontName="Helvetica-Bold", fontSize=24, textColor=MINT, alignment=TA_LEFT)
S_FB = ParagraphStyle("fb", fontName="Helvetica", fontSize=9.5, leading=13.5, textColor=INK)


def header(meta_lines):
    def _h(canvas, doc):
        canvas.saveState()
        band = 80
        canvas.setFillColor(SLATE)
        canvas.rect(0, H - band, W, band, fill=1, stroke=0)
        canvas.setFillColor(MINT)
        canvas.rect(0, H - band - 3, W, 3, fill=1, stroke=0)
        canvas.setFillColor(MINT)
        canvas.setFont("Helvetica-Bold", 16)
        canvas.drawString(40, H - 42, "RL BLACK MAGIC")
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(40, H - 56, "A I   T U T O R I N G")
        canvas.setFillColor(colors.HexColor("#cdd6d2"))
        canvas.setFont("Helvetica", 8.5)
        y = H - 38
        for line in meta_lines:
            canvas.drawRightString(W - 40, y, line)
            y -= 12
        canvas.setFillColor(colors.HexColor("#9fb0aa"))
        canvas.setFont("Helvetica", 7)
        canvas.drawString(40, 26, "RL Black Magic - demonstration material. Not affiliated with the VCAA.")
        canvas.drawRightString(W - 40, 26, "Page %d" % doc.page)
        canvas.restoreState()
    return _h


def doc(name, meta):
    d = SimpleDocTemplate(
        os.path.join(OUT, name), pagesize=A4,
        topMargin=108, bottomMargin=44, leftMargin=40, rightMargin=40,
        title="RL Black Magic", author="RL Black Magic",
    )
    d._rl_header = header(meta)
    return d


def build(d, story):
    d.build(story, onFirstPage=d._rl_header, onLaterPages=d._rl_header)


def qrow(num, text, marks):
    p = Paragraph(f"<b>{num}.</b>&nbsp;&nbsp;{text}", S_Q)
    m = Paragraph(marks, S_MARKS)
    t = Table([[p, m]], colWidths=[CONTENT_W - 60, 60])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


# (number, text, marks, solution)
QUESTIONS = [
    ("1", "Differentiate y = x<super>3</super> &minus; 4x<super>2</super> + 7x &minus; 2.", "(3 marks)",
     "dy/dx = 3x<super>2</super> &minus; 8x + 7."),
    ("2", "Find dy/dx for y = (2x + 1)<super>5</super>.", "(3 marks)",
     "Chain rule: dy/dx = 5(2x + 1)<super>4</super> &times; 2 = 10(2x + 1)<super>4</super>."),
    ("3", "Find the equation of the tangent to y = x<super>2</super> &minus; 3x at the point where x = 2.", "(4 marks)",
     "At x = 2, y = 4 &minus; 6 = &minus;2, so the point is (2, &minus;2).<br/>"
     "dy/dx = 2x &minus; 3, which equals 1 at x = 2.<br/>"
     "Tangent: y &minus; (&minus;2) = 1(x &minus; 2), i.e. y = x &minus; 4."),
    ("4", "Differentiate y = x e<super>x</super> and find the x-coordinate of the stationary point.", "(3 marks)",
     "Product rule: dy/dx = e<super>x</super> + x e<super>x</super> = e<super>x</super>(1 + x).<br/>"
     "Stationary when 1 + x = 0, so x = &minus;1."),
    ("5", "Differentiate y = ln(3x<super>2</super> + 1).", "(3 marks)",
     "Chain rule: dy/dx = 6x / (3x<super>2</super> + 1)."),
    ("6", "For the curve y = x<super>3</super> &minus; 6x<super>2</super> + 9x, find the coordinates and nature of the stationary points.", "(4 marks)",
     "dy/dx = 3x<super>2</super> &minus; 12x + 9 = 3(x &minus; 1)(x &minus; 3).<br/>"
     "Stationary points at x = 1 and x = 3.<br/>"
     "(1, 4) is a local maximum; (3, 0) is a local minimum."),
]


def make_questions():
    d = doc("practice-questions.pdf", ["QUESTION PAPER", "Methods 3 & 4", "VCAA + Modified"])
    story = [
        Paragraph("Mathematical Methods &mdash; Units 3 &amp; 4", S_TITLE),
        Paragraph("Differentiation &middot; Practice Examination 1 (Technology-free)", S_SUB),
        Paragraph("Instructions: Answer all questions in the spaces provided. Show all working. "
                  "Total: 20 marks &middot; Writing time: 30 minutes.", S_INSTR),
        HRFlowable(width="100%", color=colors.HexColor("#d7ded9"), spaceBefore=2, spaceAfter=12),
    ]
    for num, text, marks, _ in QUESTIONS:
        story.append(qrow(num, text, marks))
        story.append(Spacer(1, 54))
    build(d, story)


def make_solutions():
    d = doc("practice-solutions.pdf", ["WORKED SOLUTIONS", "Methods 3 & 4", "VCAA + Modified"])
    story = [
        Paragraph("Mathematical Methods &mdash; Units 3 &amp; 4", S_TITLE),
        Paragraph("Differentiation &middot; Practice Examination 1 &mdash; Worked Solutions", S_SUB),
        Paragraph("Full worked solutions with method marks indicated.", S_INSTR),
        HRFlowable(width="100%", color=colors.HexColor("#d7ded9"), spaceBefore=2, spaceAfter=12),
    ]
    for num, text, marks, sol in QUESTIONS:
        story.append(qrow(num, text, marks))
        story.append(Paragraph(f'<font color="{GREEN}"><b>Solution.</b></font>&nbsp; {sol}', S_SOL))
        story.append(Spacer(1, 12))
    build(d, story)


# (number, text, full, got, student, comment)
MARKED = [
    ("1", "Differentiate y = x<super>3</super> &minus; 4x<super>2</super> + 7x.", 4, 4,
     "dy/dx = 3x<super>2</super> &minus; 8x + 7", "Perfect &mdash; clean and correct."),
    ("2", "Find dy/dx for y = (2x + 1)<super>5</super>.", 4, 4,
     "10(2x + 1)<super>4</super>", "Chain rule applied correctly."),
    ("3", "Find the tangent to y = x<super>2</super> &minus; 3x where x = 2.", 4, 3,
     "gradient = 1 at (2, &minus;2), so y = x &minus; 2", "Method correct &mdash; slip in the constant. Tangent is y = x &minus; 4."),
    ("4", "Differentiate y = x e<super>x</super> and find the stationary point.", 4, 4,
     "dy/dx = e<super>x</super>(1 + x), stationary at x = &minus;1", "Excellent, fully correct."),
    ("5", "Differentiate y = ln(3x<super>2</super> + 1).", 4, 3,
     "dy/dx = 6x / (3x<super>2</super>)", "Don't drop the +1 in the denominator: 6x / (3x<super>2</super> + 1)."),
]


def marked_row(num, text, full, got, student, comment):
    full_marks = got == full
    mcolor = GREEN if full_marks else RED
    tick = "4" if full_marks else "8"  # ZapfDingbats: 4 = heavy check, 8 = heavy ballot X
    head = Paragraph(f"<b>{num}.</b>&nbsp;&nbsp;{text}", S_Q)
    mk = Paragraph(f'<font color="{mcolor}"><b>{got} / {full}</b></font>', S_MARKS)
    t = Table([[head, mk]], colWidths=[CONTENT_W - 60, 60])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    ans = Paragraph(
        f'Your working:&nbsp; <font color="{NAVY}">{student}</font>'
        f'&nbsp;&nbsp;<font name="ZapfDingbats" color="{mcolor}">{tick}</font>', S_SOL)
    fb = Paragraph(f'<i><font color="{RED}">Feedback: {comment}</font></i>', S_SOL)
    return [t, ans, fb, Spacer(1, 12)]


def make_marked():
    d = doc("ai-marked-sample.pdf", ["AI-MARKED", "Student: A. Nguyen", "Methods 3 & 4"])
    story = [
        Paragraph("Mathematical Methods &mdash; Units 3 &amp; 4", S_TITLE),
        Paragraph("Differentiation &middot; AI-Marked Submission", S_SUB),
        Spacer(1, 6),
    ]
    score = Paragraph("18 / 20", S_SCORE)
    fb = Paragraph(
        "<b>Overall: 90% &mdash; outstanding.</b><br/>Strong, well-structured methods throughout, Aisha. "
        "Two small final-line slips (Q3 constant, Q5 denominator) cost the last marks. "
        "Tidy those and you're at full marks. Great consistency on the chain and product rules.",
        S_FB)
    box = Table([[score, fb]], colWidths=[120, CONTENT_W - 120])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#eaf5ef")),
        ("BOX", (0, 0), (-1, -1), 1, MINT),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(box)
    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", color=colors.HexColor("#d7ded9"), spaceAfter=12))
    for row in MARKED:
        for fl in marked_row(*row):
            story.append(fl)
    build(d, story)


if __name__ == "__main__":
    make_questions()
    make_solutions()
    make_marked()
    print("Generated PDFs in", os.path.normpath(OUT))
    for f in sorted(os.listdir(OUT)):
        print("  -", f, os.path.getsize(os.path.join(OUT, f)), "bytes")
