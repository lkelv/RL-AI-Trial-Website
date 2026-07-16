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


# ---------------------------------------------------------------------------
# AI-marked sample paper.
#
# Reproduces the supplied marking-feedback sheet for VCE Mathematical Methods
# (MM34) - Term 1 Examination 2, with all student names removed. The same
# pre-made result is returned for any upload; the total is 29 / 40 (72.5%).
# ---------------------------------------------------------------------------

RED_H = colors.HexColor("#c0392b")

S_SECTION = ParagraphStyle("sec", fontName="Helvetica-Bold", fontSize=12.5,
                           textColor=RED_H, spaceBefore=12, spaceAfter=3)
S_BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=9.5, leading=13.5, textColor=INK)
S_NOTE = ParagraphStyle("note", fontName="Helvetica-Oblique", fontSize=8.5, leading=12,
                        textColor=GREY, leftIndent=12, spaceBefore=2)
S_OK = ParagraphStyle("ok", fontName="Helvetica", fontSize=9, leading=12.5,
                      textColor=colors.HexColor(GREEN), leftIndent=12)
S_BULLET = ParagraphStyle("bul", fontName="Helvetica", fontSize=9.5, leading=13.5,
                          textColor=INK, leftIndent=15, bulletIndent=2)

# table cell styles
S_CH = ParagraphStyle("ch", fontName="Helvetica-Bold", fontSize=9, textColor=RED_H)
S_CD = ParagraphStyle("cd", fontName="Helvetica", fontSize=9, leading=11.5, textColor=INK)
S_CDb = ParagraphStyle("cdb", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=INK)
S_CDr = ParagraphStyle("cdr", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=RED_H)


def _grid_table(data, col_widths, total_row=False):
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f7e4df")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d7ded9")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if total_row:
        style.append(("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#eaf5ef")))
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle(style))
    return t


def _summary_table():
    rows = [
        ("Section A &mdash; MC", "5 / 10", "50%", "Q2, 4, 6, 8, 9 wrong &mdash; verify assessment key"),
        ("Q1 &mdash; Rectangle &amp; Parabola", "10 / 10", "100%", "All steps correct &mdash; excellent work"),
        ("Q2 &mdash; Transformations", "8 / 10", "80%", "Q2d interval direction wrong"),
        ("Q3 &mdash; Trig Functions", "6 / 10", "60%", "Q3c SP analysis, Q3f derivative-argument errors"),
    ]
    data = [[Paragraph(h, S_CH) for h in ("Section", "Score", "%", "Key Notes")]]
    for sec, sc, pc, note in rows:
        data.append([Paragraph(sec, S_CD), Paragraph(sc, S_CDb),
                     Paragraph(pc, S_CD), Paragraph(note, S_CD)])
    data.append([Paragraph("TOTAL", S_CDr), Paragraph("29 / 40", S_CDr),
                 Paragraph("72.5%", S_CDr),
                 Paragraph("Strong Q1, good Q2, need work on trig SPs", S_CDr)])
    return _grid_table(data, [155, 58, 40, CONTENT_W - 253], total_row=True)


def _mc_table():
    rows = [
        ("Q2", "D", "C", "Answer should be C &mdash; possible misreading of the question."),
        ("Q4", "B", "A", "Answer should be A &mdash; re-check the working."),
        ("Q6", "C", "D", "Answer should be D &mdash; check domain restrictions."),
        ("Q8", "B", "D", "Answer should be D &mdash; review the concept tested."),
        ("Q9", "C", "D", "Answer should be D &mdash; check the final simplification step."),
    ]
    data = [[Paragraph(h, S_CH) for h in ("Q#", "Given", "Correct", "Note")]]
    for q, given, correct, note in rows:
        data.append([Paragraph(q, S_CDb), Paragraph(given, S_CD),
                     Paragraph(correct, S_CDb), Paragraph(note, S_CD)])
    return _grid_table(data, [40, 55, 58, CONTENT_W - 153])


def _section(title):
    return [Paragraph(title, S_SECTION),
            HRFlowable(width="100%", thickness=0.7, color=colors.HexColor("#e2b9b0"),
                       spaceBefore=1, spaceAfter=6)]


def _part(label, math, verdict, ok=True):
    color = GREEN if ok else RED
    body = f"<b>{label}</b>&nbsp;&nbsp;"
    if math:
        body += f'<font color="{NAVY}">{math}</font>&nbsp; '
    body += f'<font color="{color}">{verdict}</font>'
    return Paragraph(body, S_BODY)


def make_marked():
    d = doc("ai-marked-sample.pdf", ["AI-MARKED", "MM34 · Term 1 Exam 2", "Total: 29 / 40"])
    story = [
        Paragraph(f'<font color="#c0392b">VCE Mathematical Methods (MM34) '
                  f'&mdash; Term 1 Examination 2</font>', S_TITLE),
        Paragraph("AI-Marked Submission &middot; Marker: Trainer (AI Assistant) &middot; 2026-05-26", S_SUB),
        Spacer(1, 6),
    ]

    # score banner
    score = Paragraph("29 / 40", S_SCORE)
    fb = Paragraph(
        "<b>Overall: 72.5% &mdash; Normal.</b><br/>"
        "Strong across Q1 (perfect) and Q2 (8 / 10). Focus areas: trig stationary "
        "points (Q3c) and careful derivative substitution (Q3f). The multiple-choice "
        "section was 5 / 10 &mdash; please verify the answer key and review each "
        "incorrect item.",
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
    story += [box, Spacer(1, 12), _summary_table(), Spacer(1, 4)]

    # Section A - Multiple Choice
    story += _section("Section A &mdash; Multiple Choice (5 / 10)")
    story += [
        Paragraph(f'<font color="{GREEN}"><b>Score: 5 / 10.</b></font> '
                  "Each question is worth 1 mark; no method marks.", S_BODY),
        Paragraph("<b>Correct:</b>", S_BODY),
        Paragraph("Q1: C&nbsp;&nbsp;&nbsp; Q3: A&nbsp;&nbsp;&nbsp; Q5: A"
                  "&nbsp;&nbsp;&nbsp; Q7: D&nbsp;&nbsp;&nbsp; Q10: B", S_OK),
        Spacer(1, 4),
        Paragraph("<b>Incorrect:</b>", S_BODY),
        Spacer(1, 2),
        _mc_table(),
        Paragraph("Note: a previous, similar multiple-choice section scored 9 / 10. "
                  "Verify the correct answer key independently to rule out an "
                  "answer-key discrepancy.", S_NOTE),
    ]

    # Q1
    story += _section("Q1 &mdash; Rectangle &amp; Parabola (10 / 10)")
    story.append(Paragraph(f'<font color="{GREEN}"><b>Result: FULL MARKS</b></font> '
                           "&mdash; excellent work across all parts.", S_BODY))
    q1 = [
        ("Q1a(i) [1]", "A(t) = t(4 &minus; t<super>2</super>)", "correct expression"),
        ("Q1a(ii) [2]", "t = 2&middot;sqrt(3) / 3,&nbsp; A_max = 16&middot;sqrt(3) / 9", "both correct"),
        ("Q1b(i) [1]", "y = &minus;2px + 4 + p<super>2</super>", "correct tangent"),
        ("Q1b(ii) [1]", "S = (0, 4 + p<super>2</super>),&nbsp; U = ((4 + p<super>2</super>) / 2p, 0)", "both coordinates correct"),
        ("Q1b(iii) [1]", "Area = (4 + p<super>2</super>)<super>2</super> / 4p", "correct area expression"),
        ("Q1b(iv) [2]", "p = 2&middot;sqrt(3) / 3,&nbsp; min area = 32&middot;sqrt(3) / 9", "correct"),
        ("Q1c [2]", "p = sqrt(3k) / 3,&nbsp; min area = 4k&middot;sqrt(3k) / 9", "correct general solution"),
    ]
    for label, math, verdict in q1:
        story.append(_part(label, math, verdict, ok=True))
    story.append(Paragraph(f'<font color="{GREEN}"><b>Q1 Total: 10 / 10</b></font> '
                           "&mdash; outstanding. All working clear and algebra precise.", S_BODY))

    # Q2
    story += _section("Q2 &mdash; Transformations (8 / 10)")
    story.append(Paragraph(
        "Question: f(x) = &minus;x<super>2</super> + 4x. Transformations: dilation by "
        "factor 2/a from the y-axis, dilation by 1/a from the x-axis, translation c "
        "units up.", S_BODY))
    story.append(_part("Q2a [2/2]", "g(x) = &minus;2x<super>2</super>/a<super>2</super> + 4x/a + c,&nbsp; domain [0, 2a]", "correct expression and domain"))
    story.append(_part("Q2b [1/1]", "vertex (a, 2 + c)", "correct"))
    story.append(_part("Q2c [2/2]", "intersections at x = 0 and x = 2a/(a + 1)", "correct"))
    story.append(_part("Q2d [0/2]", "correct answer: x = 0 together with [3/2, 2]", "wrong interval direction", ok=False))
    story.append(Paragraph("The submitted answer [0, 3/2] is the opposite interval "
                           "direction: the condition requires values at or beyond 3/2, "
                           "not between 0 and 3/2.", S_NOTE))
    story.append(_part("Q2e [3/3]", "x = a/(a + 1),&nbsp; c = 2(a &minus; 1)/(a + 1)", "correct working and condition"))
    story.append(Paragraph(f'<font color="{GREEN}"><b>Q2 Total: 8 / 10</b></font> '
                           "&mdash; strong algebraic work; revisit interpreting interval "
                           "conditions (Q2d).", S_BODY))

    # Q3
    story += _section("Q3 &mdash; Trig Functions&nbsp; f(x) = 3sin(2x) + sin(6x)&nbsp; (6 / 10)")
    story.append(_part("Q3a [1/1]", "period = pi", "correct"))
    story.append(_part("Q3b [2/2]", "f(x) &gt; 0 on (n&middot;pi, n&middot;pi + pi/2)", "correct domain"))
    story.append(_part("Q3c [1/3]", "f'(x) = 6cos(2x) + 6cos(6x) = 0", "derivative set up correctly", ok=True))
    story.append(Paragraph("Errors in the stationary points: found x = pi/6 (should be "
                           "pi/8) and 5pi/6 (should be 5pi/8); the y-value sqrt(2) at "
                           "x = pi/4 should be 2&middot;sqrt(2). Only x = pi/4 and 3pi/8 "
                           "were correct. Enumerate the cos(4x)&middot;cos(2x) = 0 "
                           "branches systematically.", S_NOTE))
    story.append(_part("Q3d [1/1]", "range [&minus;2&middot;sqrt(2), 2&middot;sqrt(2)]", "correct"))
    story.append(_part("Q3f [0/2]", "solve f'(pi/9) = f'(2pi/9)", "incorrect derivative evaluation", ok=False))
    story.append(Paragraph("The wrong derivative arguments were substituted; the final "
                           "answer of 59 degrees differs from the solution. Substitute "
                           "carefully and check each term before combining.", S_NOTE))
    story.append(_part("Q3g [1/1]", "6 distinct values", "correct count"))
    story.append(Paragraph(f'<font color="{GREEN}"><b>Q3 Total: 6 / 10</b></font> '
                           "&mdash; Q3a, b, d, g done well; Q3c and Q3f need attention.", S_BODY))

    # Final summary
    story += _section("Final Summary")
    story.append(Paragraph("<b>Total Score: 29 / 40 (72.5%) &mdash; Normal</b>", S_BODY))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f'<font color="{GREEN}"><b>Strengths</b></font>', S_BODY))
    for s in [
        "Q1: perfect 10 / 10 &mdash; excellent algebraic manipulation and optimisation.",
        "Q2: strong on transformations (8 / 10) &mdash; almost all parts correct.",
        "Q3a, Q3b, Q3d: good grasp of trig period, sign analysis, and range.",
        "Q3g: correct count of distinct values.",
        "Working is generally well-structured and clearly laid out.",
    ]:
        story.append(Paragraph(s, S_BULLET, bulletText="•"))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f'<font color="{RED}"><b>Areas for improvement</b></font>', S_BODY))
    for s in [
        "Q2d: interval conditions from inequality analysis &mdash; mind the direction of the intersection sets.",
        "Q3c: solving cos(4x)&middot;cos(2x) = 0 &mdash; enumerate solutions from each factor systematically.",
        "Q3c: verify stationary-point y-values by substituting back into f(x).",
        "Q3f: substitute carefully into the derivative &mdash; check each term before combining.",
        "Multiple choice: 5 / 10 is below the usual standard &mdash; verify the answer key and review each incorrect item.",
    ]:
        story.append(Paragraph(s, S_BULLET, bulletText="•"))

    build(d, story)


if __name__ == "__main__":
    make_questions()
    make_solutions()
    make_marked()
    print("Generated PDFs in", os.path.normpath(OUT))
    for f in sorted(os.listdir(OUT)):
        print("  -", f, os.path.getsize(os.path.join(OUT, f)), "bytes")
