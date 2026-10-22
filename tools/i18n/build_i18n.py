# -*- coding: utf-8 -*-
"""Build web/i18n.json from:
   - keys.txt      (source-extracted Persian strings, one per line: index<TAB>group<TAB>fa)
   - live_only.txt (strings seen in the live DOM that the source scan missed)
   - SRC / LIVE    (English, keyed by the line index in those files)
   - PATTERNS      (Persian templates with {0} slots -> English templates)

Every English entry is looked up by index, so the Persian side is never retyped and
ZWNJ characters cannot be mangled. The script reports unmatched extra keys.
"""
import io, json, re, sys, os

# The inputs (keys.txt, live_only.txt) live next to this script inside the repo, and the
# output is always web/i18n.json — nothing here depends on a machine-specific path.
HERE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.abspath(os.path.join(HERE, '..', '..', 'web'))
OUT = HERE
FA_LETTER = re.compile(r'[\u0621-\u063A\u0641-\u064A]')

SRC_BLOCK = r'''
0|Alum Metal Arak
1|Alum Metal menu
2|Home
3|Weight calculator
4|Product catalogue
5|Alloy encyclopedia
6|Enter elements, get alloys
7|Pick an alloy by application
8|Compare alloys
9|Contact us
10|Settings
11|Quality, innovation and customer satisfaction
12|Alum Metal Arak — production and supply of aluminium sections and products
13|Alloy expertise, production quality
14|Install the Alum Metal app on your home screen
15|Faster access, full screen and works offline.
16|Install
17|Alum Metal daily notifications
18|Two short messages a day; allow notifications to enable them.
19|Enable
20|Quick access
21|Aluminium weight calculator
22|Fast and accurate calculation
23|Industrial and building solutions
24|Technical data for every grade
25|Suggest an alloy from its composition
26|Technical data side by side
27|Suggest an alloy from the application
28|Get expert advice
29|Precise tools
30|Section weight calculator
31|Pick the section and alloy that match Alum Metal products.
32|How to use
33|How is the weight calculated?
34|First choose the section and the alloy, then enter the length and the dimensions marked on the drawing in millimetres. For several pieces change the quantity and press the weight button.
35|The letters on the drawing are the dimensions you enter in the boxes below.
36|Section type
37|Section dimension guide
38|Alloy
39|Length (mm)
40|Width (mm)
41|Thickness (mm)
42|Quantity
43|The result appears here
44|Product library
45|Official Alum Metal product catalogues; contact us for stock and prices.
46|Contact us for stock and prices
47|Our sales engineers are here to help.
48|Loading the list…
49|Alloy encyclopedia
50|Complete table of wrought and casting alloys with technical data and applications.
51|Contact us for alloy stock and prices
52|All
53|Series 1000
54|Series 2000
55|Series 3000
56|Series 4000
57|Series 5000
58|Series 6000
59|Series 7000
60|Series 8000
61|Loading the alloy encyclopedia…
62|Find an alloy
63|Type one element value; the closest alloys are suggested with a match percentage.
64|One element is enough
65|You do not need to fill them all; the result updates live.
66|Quick sample:
67|Silicon
68|Iron
69|Copper
70|Manganese
71|Magnesium
72|Chromium
73|Zinc
74|Titanium
75|Nickel
76|Lithium
77|Clear values
78|Do not know the composition? “Pick an alloy by application” →
79|Know the alloy code?
80|Enter one element value to see the closest alloys.
81|Quick pick
82|Just say what the part is for; the closest alloys are suggested with a match percentage.
83|Choose your application
84|If you do not know the element percentages, start here; one choice is enough.
85|Profiles, doors and windows
86|Structure and industry
87|Marine and corrosion resistant
88|Sheet and containers
89|Aerospace and high strength
90|Casting
91|Electrical conductivity
92|Welding and filler
93|Precision machining
94|Foil and packaging
95|Clear selection
96|I know the composition; “Enter elements, get alloys” →
97|Choose one of the applications above to see suitable alloys.
98|Alloy comparison
99|Compare alloys
100|Choose at least two alloys and see their technical data side by side.
101|Choose two alloys.
102|First choice
103|Choose an alloy
104|Second choice
105|Third choice
106|Optional
107|No selection
108|Show comparison
109|Comparison result
110|Clear
111|Contact Alum Metal
112|Call us for advice, quotations and order follow-up.
113|Direct contact
114|Support and sales
115|Sales phone
116|Mobile 1
117|Mobile 2
118|Head office address
119|Arak, Daneshgah St., Hatef Building, 3rd floor, unit 4
120|Arak, Kheyrabad Industrial Estate
121|Social networks
122|Follow us
123|Telegram
124|Bale
125|Alum Metal channel
126|Eitaa
127|Rubika
128|Alum Metal page
129|Visit the official website
130|App control
131|Personalise the look and language of the app.
132|App language
133|English
134|Night mode
135|Off
136|Daily notifications
137|Checking…
138|Update the app
139|Install the app on the home screen
140|Install guide
141|Catalogue
142|Contact
143|Preview
144|A new app version is ready
145|To apply it, the old cache is cleared and the app reloads.
146|Update
147|Later
148|Alum Metal Arak; production and supply of aluminium sections and products
149|Open the menu
150|Alum Metal home
151|Alum Metal logo
152|Toggle theme
153|Full screen
154|Alum Metal
155|Close the menu
156|Dismiss the install banner
157|Dismiss the notification banner
158|Round section dimension guide
159|e.g. 1000
160|e.g. 500
161|e.g. 2
162|Search by code, use or property
163|e.g. 0.45
164|e.g. 6061
165|Main navigation
166|Close the preview
167|Close the update dialog
168|Sheet catalogue
169|Alloys, tempers, available widths and thicknesses
170|Temper
171|Sheet width
172|Sheet thickness
173|Round bar catalogue
174|Available diameters and weight per metre
175|Diameter
176|Weight per metre
177|Flat bar and square catalogue
178|Section dimensions and weight per metre
179|Dimensions
180|Pipe catalogue
181|Outer diameter, wall thickness and weight per metre
182|Outer diameter
183|Thickness
184|Pipe catalogue — inner diameter
185|Outer diameter, inner diameter and bar length
186|Inner diameter
187|Bar length
188|Hex bar catalogue
189|Size and weight per metre
190|Size
191|Sheet / plate
192|Length
193|Width
194|Round bar
195|Square bar
196|Height
197|Flat bar
198|Pipe
199|Hex bar
200|Side
201|6063 — profiles and extrusion
202|6061 — industrial and structural
203|6060 — general sections
204|6005 — industrial sections
205|6082 — higher-strength structural
206|5052 — sheet and wet environments
207|5083 — industrial and marine sheet
208|2024 — 2000 series
209|7075 — high strength
210|7000 series — alloyed sections
211|1050 — general sheet
212|Pure aluminium
213|High conductivity and formability
214|General sheet, containers, packaging and electrical parts
215|Electrical, sheet metal work, packaging
216|Al ≥ 99%; negligible alloying elements
217|Low strength, very good formability
218|Density about 2.71 g/cm³; high thermal and electrical conductivity
219|Follows the series family; real corrosion resistance depends on temper, surface and service environment.
220|Depends on grade and temper; check the grade analysis/standard sheet for this series.
221|AA / ASTM / EN; the exact equivalent must be confirmed at purchase.
222|General conductivity and formability
223|Excellent formability
224|Heat exchangers, containers and general uses
225|Aluminium-copper
226|High strength and machinability
227|Aerospace, machined parts and structures
228|Al–Cu; usually also Mg and Mn
229|High strength and good machinability; more limited weldability
230|Density about 2.78–2.83 g/cm³; more sensitive to corrosion
231|Very good machinability
232|Turned parts and precision fittings
233|High strength-to-weight ratio
234|Aerospace parts and engineering structures
235|Aluminium-manganese
236|Good corrosion resistance and formability
237|Containers, tanks, heat exchangers and sheet metal work
238|Tanks, household equipment and sheet metal work
239|Al–Mn; sometimes Mg and Cu
240|Moderate strength and good formability
241|Density about 2.72–2.73 g/cm³; good corrosion resistance
242|Formability and corrosion resistance
243|Formability and corrosion resistance
244|Doors and windows, façades and building sheet
245|Aluminium-silicon
246|Heat resistance and welding
247|Welding, filler and castings
248|Al–Si; silicon is the main element
249|Good wear and heat resistance; good fluidity
250|Density about 2.68–2.69 g/cm³; lower thermal expansion
251|Heat and wear resistance
252|Engine parts and automotive uses
253|Fluidity and weldability
254|Welding filler and castings
255|Aluminium-magnesium
256|Corrosion resistance and weldability
257|Marine industry, tanks and industrial sheet
258|Al–Mg; may also contain Mn and Cr
259|Good strength, excellent weldability and corrosion resistance
260|Density about 2.66–2.68 g/cm³; suited to marine environments
261|Excellent corrosion resistance
262|Sheet metal work, fuel tanks and wet environments
263|Strength and marine resistance
264|Marine structures, tanks and heavy industry
265|Good welding and corrosion behaviour
266|Shipbuilding and marine structures
267|Automotive, sheet metal work and chemical industry
268|Aluminium-magnesium-silicon
269|Good strength for extrusion
270|Industrial sections and light structures
271|Profiles, building and machinery
272|Al–Mg–Si; sometimes Cu and Mn
273|Balanced strength, extrusion, machinability and weldability
274|Density about 2.69–2.71 g/cm³; heat treatable
275|Balanced strength and extrusion
276|Good strength and machinability
277|Industrial sections, machined parts and light structures
278|Good extrusion and surface
279|Profiles and general sections
280|Balanced strength and machinability
281|Industrial parts, structures, frames and equipment
282|Excellent extrusion and surface quality
283|Building and decorative profiles, heat sinks
284|Higher strength and good welding
285|Structures, machinery and industrial parts
286|High electrical conductivity
287|Busbars and power transmission equipment
288|Aluminium-zinc
289|Strength and weldability
290|Bicycles and strong light structures
291|Aerospace, defence and sports equipment
292|Al–Zn; usually also Mg and Cu
293|Very high strength for highly loaded parts
294|Density about 2.78–2.83 g/cm³; stress-corrosion sensitivity
295|Very high strength
296|High strength in thick sections
297|Aerospace and heavy engineering parts
298|Aerospace, engineering parts and sports equipment
299|Aluminium with other elements
300|Light and formable
301|Foil, packaging and general sheet
302|Foil, packaging and aerospace
303|Al with Li or other special elements
304|Low weight and grade-specific properties
305|Variable density; some grades are designed for weight saving
306|Aluminium-lithium
307|Low weight and good strength
308|Specialised aerospace uses
309|Aluminium with special elements
310|Low weight and specialised use
311|Casting alloy
312|General castings and engineering parts
313|Castings and alloy ingots
314|Industrial parts, housings and castings
315|Composition depends on the casting grade and production standard
316|Mechanical properties depend on the casting method, heat treatment and porosity
317|Density about 2.70 g/cm³; thermal behaviour depends on composition
318|Depends on the chemical composition and surface quality.
319|Some grades such as A356.0 can be heat treated.
320|AA Casting / ASTM; the .0 suffix is a casting and .1 an ingot.
321|Casting with good strength and fluidity
322|Precision castings and light parts
323|Die casting and industrial parts
324|Casting with high fluidity
325|Casting with good formability
326|Aluminium-magnesium casting
327|Specialised aluminium-zinc casting
328|Density about 2.71 g/cm³; high electrical and thermal conductivity
329|High strength, good machinability, more limited weldability
330|Moderate strength, good formability and corrosion resistance
331|Density about 2.72–2.73 g/cm³; non-magnetic
332|Al–Si; silicon is the main alloying element
333|Good wear and heat resistance; good fluidity in casting
334|Very high strength, suited to highly loaded engineering parts
335|Density about 2.78–2.83 g/cm³; more stress-corrosion sensitivity
336|Low weight and alloy-specific properties
337|Series 1000 — pure aluminium
338|Series 2000 — aluminium-copper
339|Series 3000 — aluminium-manganese
340|Series 4000 — aluminium-silicon
341|Series 5000 — aluminium-magnesium
342|Series 6000 — aluminium-magnesium-silicon
343|Series 7000 — aluminium-zinc
344|Series 8000 — special alloys
345|Casting alloys
346|On
347|Turn on night mode
348|Day mode
349|The app language is Persian.
350|Full screen is not available in this browser
351|Square section dimension guide
352|Flat bar dimension guide
353|Hex bar dimension guide
354|Sheet dimension guide
355|Pipe dimension guide
356|Please enter all required dimensions as positive numbers.
357|Show summary
358|Show the full table
359|Suited to conductivity, forming and general uses.
360|Chosen for high strength and machined parts; its corrosion resistance usually needs a suitable coating or maintenance.
361|Offers a good balance of formability, corrosion resistance and moderate strength.
362|Silicon improves fluidity, heat resistance or welding behaviour.
363|Suited to wet and marine environments and usually has good weldability.
364|A balanced choice for profiles and structures; extrusion, machining and heat treatment matter.
365|Its main focus is strength and it is used for light, highly loaded engineering parts.
366|Used for specialised applications such as foil, packaging or aerospace.
367|Choose at least two alloys to compare.
368|Family
369|Series
370|Main elements
371|Mechanical properties
372|Physical properties
373|Corrosion resistance
374|Heat treatment
375|Standards
376|Density
377|Main property
378|Main use
379|Series applications
380|Not recorded
381|Property
382|You searched this code directly; press “Details in the alloy encyclopedia” to see the full data.
383|Some entered values are outside this grade’s range; it is the closest option in this list.
384|The stated range for this grade is approximate.
385|Approximate range
386|Exact code
387|Pick the closest available code:
388|Where do I start?
389|Popular grades:
390|Nothing to suggest
391|Change the element value a little or use “Pick an alloy by application”.
392|Closest alloys to the entered composition
393|The match percentage is the distance between your composition and each grade’s standard range; confirm the analysis sheet and product standard before the final choice.
394|Which application shall we start from?
395|Choose one of the applications above to see the alloys suggested for it. If you know the code or composition, “Enter elements, get alloys” is more precise.
396|No suggestion found for this application
397|Try another application.
398|These suggestions are based on each grade’s typical use; confirm the analysis sheet and product standard before the final choice.
399|Three alloys are selected; change one of them to modify the comparison.
400|Use and standard
401|Code
402|Series / family
403|Details
404|No alloy matches this search.
405|Open the original file ↗
406|Open the original page or file ↗
407|Open the app in
408|.
409|Tap the
410|Share
411|button (a square with an arrow pointing up).
412|Choose
413|or “Add to Home Screen”.
414|Confirm the name “Alum Metal” and
415|.
416|Open the app in
417|or
418|Open the browser menu (⋮ or ⋯).
419|or tap “Install app”.
420|If you cannot see it, choose “Add to Home Screen” from the same menu.
421|If you have already installed the app this option is hidden. Installing on Android and iOS needs an
422|address; it also works on localhost.
423|One tap to install; no digging through browser settings.
424|See the step-by-step guide to install on the home screen.
425|Install guide
426|Quick install
427|Add the app to the home screen
428|The Alum Metal app was installed on the home screen
429|Calculate section weight in seconds; the “Weight calculator” is built into this app.
430|The product catalogue is up to date; see sheet, round bar, profiles and special sections.
431|Have the element percentages? “Enter elements, get alloys” suggests the closest grades.
432|Call our sales engineers for stock and prices: 086-33257316
433|Cannot find the right alloy for your application? Try “Pick an alloy by application”.
434|6063 is the most widely used building-profile alloy; its full data is in the alloy encyclopedia.
435|Compare two alloys side by side for a safer choice.
436|Install the Alum Metal app on your home screen for faster access.
437|Technical note: aluminium density is 2.66–2.81 g/cm³; the calculator picks the right density itself.
438|Aluminium sheet from 0.1 to 500 mm thick; ask our sales engineers for availability.
439|5000-series alloys resist corrosion well in wet and marine environments.
440|Every time you open the app, the latest version and data are fetched.
441|Not available in this browser
442|Blocked
443|Waiting for permission
444|Off
445|This browser does not support notifications.
446|Daily notifications are on; you will get two messages a day.
447|Notification permission was denied; enable it from the browser settings.
448|Notification permission was not granted.
449|Notification permission is blocked in the browser settings.
450|Daily notifications are off.
451|Daily notifications are on; two messages a day.
452|Updating…
453|Up to date
454|New version available
455|Checks when online
456|No new version is available; you are on the latest one.
'''

LIVE_BLOCK = r'''
6|Pools
8|Casting
10|View
57|%
58|Just write one element value (for example Si = 0.45); we do the rest. If you do not know the composition, try “Pick an alloy by application”.
59|Automotive
60|Heat exchangers
165|Sheet
166|Flat bar & square
167|Inside-diameter pipe
168|Hex
169|Diameter (mm)
170|— (mm)
171|Height (mm)
172|Outer diameter (mm)
173|Side (mm)
185|Details in the alloy encyclopedia ←
186|＋ Add to comparison
215|Inner diameter (mm)
216|Size (mm)
217|New version alerts
218|New-version alerts are on; you will only hear from us when a new version is published.
219|New-version alerts are off.
220|Opens faster than the browser
221|Full screen, without the address bar
222|Works without an internet connection
223|You get new-version alerts
224|Open the app in the Safari browser.
225|Tap the Share button (the square with the arrow pointing up).
226|Choose “Add to Home Screen”.
227|Confirm the name “Alum Metal”.
228|Open the app in the Chrome or Edge browser.
229|Open the browser menu (the three dots).
230|Tap “Install app” or “Add to Home Screen”.
231|Confirm and the app icon lands on your home screen.
232|On iPhone and iPad
233|On Android and desktop
234|Install app
235|Installing on Android and iOS needs an https address; on a computer the app can be installed too.
236|Share the app
237|Link & QR
238|QR code of the Alum Metal app
239|Scan this code with your phone camera to open the app.
240|Copy link
241|Link copied.
242|Alum Metal Arak app: section weight calculator, product catalogue and alloy database
243|Could not copy; select the address manually.
244|Not available right now'''

PATTERNS_BLOCK = r'''
وزن تقریبی: {0} کیلوگرم — چگالی {1} گرم بر سانتی‌متر مکعب|Approximate weight: {0} kg — density {1} g/cm³
{0} گرم بر سانتی‌متر مکعب|{0} g/cm³
{0} آلیاژ پیدا شد — چگالی‌ها تقریبی هستند.|{0} alloys found — densities are approximate.
{0} آلیاژ برای مقایسه آماده است.|{0} alloys ready to compare.
تطابق {0}٪|{0}% match
{0} ردیف|{0} rows
نمایش {0} ردیف نخست|Show the first {0} rows
نسخهٔ {0} — تاریخ انتشار {1}|Version {0} — released {1}
نسخهٔ {0}|Version {0}
سری {0}|Series {0}
{0} به مقایسه اضافه شد|{0} added to the comparison
کد آلیاژ «{0}»|Alloy code “{0}”
کدی با «{0}» پیدا نشد|No code matching “{0}” was found
پیشنهاد برای کاربرد «{0}»|Suggestions for the “{0}” use case
{0} با تمرکز بر {1}. {2} کاربردهای رایج: {3}.|{0} for {1}. {2} Common applications: {3}.
هر {0} عنصر واردشده داخل محدوده استاندارد این گرید است. {1} کاربرد رایج: {2}.|Every {0} entered elements fall inside this grade’s standard range. {1} Typical use: {2}.
هر {0} عنصر واردشده داخل محدوده استاندارد این گرید است. کاربرد رایج: {1}.|Every {0} entered elements fall inside this grade’s standard range. Typical use: {1}.
با کاربرد «{0}» هم‌خوانی دارد. {1} کاربرد رایج: {2}.|Matches the “{0}” use case. {1} Typical use: {2}.
با کاربرد «{0}» هم‌خوانی دارد. کاربرد رایج: {1}.|Matches the “{0}” use case. Typical use: {1}.
محدوده اعلام‌شده برای این گرید تقریبی است. کاربرد رایج: {0}.|The stated range for this grade is approximate. Typical use: {0}.
کاربرد رایج: {0}.|Typical use: {0}.
هر {0} عنصر واردشده داخل محدوده استاندارد این گرید است.|Every {0} entered elements fall inside this grade’s standard range.
با کاربرد «{0}» هم‌خوانی دارد.|Matches the “{0}” use case.
{0} · {1}|{0} · {1}
{0} — {1}|{0} — {1}
'''


def parse_block(block):
    """index|english -> {int: str}"""
    out = {}
    for line in block.strip().split('\n'):
        line = line.strip('\n')
        if not line.strip():
            continue
        index, _, english = line.partition('|')
        out[int(index)] = english
    return out


def read_lines(path):
    return [line for line in io.open(path, encoding='utf-8').read().split('\n') if line.strip()]


def split_keys(path):
    """index<TAB>group<TAB>fa (keys.txt) or fa (live_only.txt)"""
    values = []
    for line in read_lines(path):
        parts = line.split('\t')
        values.append(parts[-1])
    return values


source_keys = split_keys(OUT + r'\keys.txt')
live_keys = split_keys(OUT + r'\live_only.txt')

src_en = parse_block(SRC_BLOCK)
live_en = parse_block(LIVE_BLOCK)
patterns = {}
for line in PATTERNS_BLOCK.strip().split('\n'):
    if not line.strip():
        continue
    fa, _, en = line.partition('|')
    patterns[fa] = en

mapping = {}
problems = []
for index, english in src_en.items():
    if index >= len(source_keys):
        problems.append(f'src index out of range: {index}')
        continue
    mapping[source_keys[index]] = english
for index, english in live_en.items():
    if index >= len(live_keys):
        problems.append(f'live index out of range: {index}')
        continue
    mapping[live_keys[index]] = english

# numeric-only + composed keys need no entry
missing_src = [i for i in range(len(source_keys)) if i not in src_en]
print('source keys without a translation:', len(missing_src))
for i in missing_src:
    print('   src', i, repr(source_keys[i]))
missing_live = [i for i in range(len(live_keys)) if i not in live_en]
print('live keys left to the patterns:', len(missing_live))

# sanity: no Persian left inside an English value (except the intentional '٪' mapping)
bad = {k: v for k, v in mapping.items() if FA_LETTER.search(v)}
print('english values containing Persian letters:', len(bad))
for k, v in list(bad.items())[:20]:
    print('   !', repr(v))

print('problems:', problems)

i18n = {'version': 1, 'map': mapping, 'patterns': patterns}
with io.open(WEB + r'\i18n.json', 'w', encoding='utf-8') as handle:
    json.dump(i18n, handle, ensure_ascii=False, indent=1, sort_keys=True)
print('wrote i18n.json: map', len(mapping), 'patterns', len(patterns))

with io.open(OUT + r'\review.txt', 'w', encoding='utf-8') as handle:
    for key in source_keys:
        handle.write(f'{key}\t{mapping.get(key, "<skipped>")}\n')
    handle.write('\n---- live ----\n')
    for key in live_keys:
        handle.write(f'{key}\t{mapping.get(key, "<pattern/skip>")}\n')
    handle.write('\n---- patterns ----\n')
    for fa, en in patterns.items():
        handle.write(f'{fa}\t{en}\n')
