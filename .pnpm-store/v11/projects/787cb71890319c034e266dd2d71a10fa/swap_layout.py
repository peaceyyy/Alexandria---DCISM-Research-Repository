import codecs

path = 'c:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/Alexandria/app/admin/review/[id]/page.tsx'
with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

# 1. Update gridTemplateColumns
content = content.replace('gridTemplateColumns: reviewPanelOpen ? "1fr 300px" : "1fr 44px",', 'gridTemplateColumns: reviewPanelOpen ? "300px 1fr" : "44px 1fr",')
content = content.replace('gridTemplateColumns: reviewPanelOpen ? "1fr 300px" : "1fr 44px"', 'gridTemplateColumns: reviewPanelOpen ? "300px 1fr" : "44px 1fr"')

# 2. Swap chevrons
old_chevrons = '''{reviewPanelOpen ? (
              <ChevronRight size={14} aria-hidden />
            ) : (
              <ChevronLeft size={14} aria-hidden />
            )}'''
new_chevrons = '''{reviewPanelOpen ? (
              <ChevronLeft size={14} aria-hidden />
            ) : (
              <ChevronRight size={14} aria-hidden />
            )}'''
content = content.replace(old_chevrons, new_chevrons)

# 3. Swap Left and Right Panels
left_panel_start = content.find('{/* ════════════════════════════════════════════════════════════════\n            LEFT PANEL')
right_panel_start = content.find('{/* ════════════════════════════════════════════════════════════════\n            RIGHT PANEL')
right_panel_end = content.find('{/* ── Floating Comment Panel')

if left_panel_start != -1 and right_panel_start != -1 and right_panel_end != -1:
    left_panel_code = content[left_panel_start:right_panel_start]
    right_panel_code = content[right_panel_start:right_panel_end]

    # Modify the sticky container for the right panel (which will now be left panel)
    sticky_container = '          style={{\n            position: "sticky",\n            top: 24,\n            display: "flex",\n            flexDirection: "column",\n            gap: 0,\n          }}\n        >'
    sticky_replacement = '          style={{\n            position: "sticky",\n            top: 24,\n            display: "flex",\n            flexDirection: "column",\n            gap: 0,\n          }}\n        >\n          <div style={{ paddingBottom: 16 }}>\n            <BackLink />\n          </div>'
    new_right_panel_code = right_panel_code.replace(sticky_container, sticky_replacement)

    # Strip out the <BackLink /> that was at the top before the Two-column layout
    content = content.replace('<BackLink />\n\n      {/* ── Two-column layout', '{/* ── Two-column layout')

    # Now reassemble
    final_content = content[:left_panel_start] + new_right_panel_code + left_panel_code + content[right_panel_end:]

    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(final_content)
    print("Success")
else:
    print("Could not find sections")
