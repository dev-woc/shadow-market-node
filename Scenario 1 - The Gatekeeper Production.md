# Scenario 1: The Gatekeeper - Production Doc

> **LeetCode:** Two Sum (#1) | **Concept:** Hash Map | **Difficulty:** Easy

---

## Overview

The player discovers a Shadow Market storefront, but it's locked behind a verification system. To prove you're not a bot, you must purchase exactly $100 worth of items from a randomized price list. The catch? You can only buy TWO items, and you need to find the exact pair that hits the target.

---

## Narrative Script

### Cold Open (0:00 - 0:30)
```
[SCREEN: Dark browser window, loading...]
[URL bar types out: shadow-market.onion]

[STOREFRONT LOADS - Neon cyberpunk aesthetic, items with prices]

NARRATOR: "You found it. The Shadow Market. Everything you need to disappear... or destroy someone's digital life."

[MOUSE hovers over "ENTER STORE" button]
[CLICK]

[SCREEN FLASH - ACCESS DENIED]

GATEKEEPER: "Verification required. Purchase exactly $100 to prove you're human."

NARRATOR: "A bot filter. They want you to do math. Specifically... Two Sum."
```

### The Setup (0:30 - 1:00)
```
[PRICE LIST appears on screen - items with prices]

prices = [15, 85, 40, 20, 60, 35, 65, 80, 55, 45]
target = 100

[ITEMS VISUALIZED: Each price attached to a shady product]
$15 - Burner SIM
$85 - Fake Passport
$40 - Encrypted USB
$20 - VPN Lifetime Key
$60 - Credit Card Skimmer
$35 - Lock Pick Set
$65 - Drone Jammer
$80 - Night Vision
$55 - Signal Blocker
$45 - RF Scanner

NARRATOR: "Ten items. Ten prices. You need to find TWO that add up to exactly 100."

[PAUSE - Let viewer scan the list]

NARRATOR: "Can you see it? Can you see the pair?"

[BEAT]

NARRATOR: "Your eyes are doing what's called a brute force search. Checking 15 + 85... 15 + 40... It works. But it's slow. And in this game, slow gets you caught."
```

---

## Teaching Segments

### Segment 1: The Problem, Clearly Stated (1:00 - 1:45)

**Goal:** Make sure everyone understands the problem before solving it.

```
[SIMPLE SLIDE - Clean, minimal]

THE PROBLEM:
Given an array of numbers and a target sum,
find TWO numbers that add up to the target.
Return their positions (indices).

[EXAMPLE ANIMATION]
prices = [15, 85, 40, 20, 60]
target = 100

Answer: indices [0, 1]
Because: prices[0] + prices[1] = 15 + 85 = 100
```

**Script:**
```
NARRATOR: "Let's slow down. What are we actually being asked?"

[TEXT APPEARS LINE BY LINE]

NARRATOR: "We have a list of numbers. We have a target. We need to find which TWO numbers add up to that target. And we return WHERE those numbers are - their positions in the list."

[HIGHLIGHT: Index 0 = 15, Index 1 = 85]

NARRATOR: "In programming, we call these positions 'indices.' The first item is at index 0. The second is at index 1. And so on."

[PAUSE]

NARRATOR: "One more thing: there's always exactly one answer. We won't have zero solutions. We won't have multiple solutions. One pair. That's it."
```

---

### Segment 2: The Brute Force Approach (1:45 - 3:30)

**Concept:** Nested Loops - O(n²)

**Visual Breakdown:**

```
[SHOW THE ARRAY]
prices = [15, 85, 40, 20, 60]
target = 100

[STEP BY STEP ANIMATION]

ROUND 1: Fix the first number at 15
- Is 15 + 85 = 100? YES! FOUND IT!

But let's pretend we didn't find it early...

ROUND 2: Fix the first number at 85
- Is 85 + 40 = 100? No (125)
- Is 85 + 20 = 100? No (105)
- Is 85 + 60 = 100? No (145)

ROUND 3: Fix the first number at 40
- Is 40 + 20 = 100? No (60)
- Is 40 + 60 = 100? YES! FOUND IT!
(Indices 2 and 4)
```

**Code (show line by line):**

```javascript
function twoSum(prices, target) {
  // Check every possible pair
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {

      // Do these two add up to target?
      if (prices[i] + prices[j] === target) {
        return [i, j];  // Found it! Return the positions
      }

    }
  }
}
```

**Visual - The Loop Animation:**
```
[GRID showing all comparisons]

     0    1    2    3    4
0    -   ✓
1    -    -    ✓    ✓    ✓
2    -    -    -    ✓    ✓
3    -    -    -    -    ✓
4    -    -    -    -    -

Each ✓ = one comparison
Total comparisons for 5 items = 10
For 10 items = 45
For 100 items = 4,950
For 1000 items = 499,500
```

**Script:**
```
NARRATOR: "The most natural approach: try every possible pair. Pick the first item, then check it against every item that comes after it."

[ANIMATION: Outer loop picks item 0]
[ANIMATION: Inner loop checks items 1, 2, 3, 4...]

NARRATOR: "This is called a nested loop. A loop inside a loop. For every item in the outer loop, we run the ENTIRE inner loop."

[SHOW COMPARISON GRID]

NARRATOR: "See this grid? Every checkmark is one comparison. For just 5 items, that's 10 comparisons. Seems fine, right?"

[GRID EXPANDS]

NARRATOR: "But watch what happens as the list grows. 10 items? 45 comparisons. 100 items? Nearly 5,000. A thousand items? Half a million."

[BIG O NOTATION APPEARS: O(n²)]

NARRATOR: "This is called 'n squared' complexity. When your input doubles, your work QUADRUPLES. It doesn't scale."

[SHOW GATEKEEPER with timer counting down]

NARRATOR: "And when the Gatekeeper's bot detection has a timeout... you can't afford n-squared."
```

---

### Segment 3: The Key Insight (3:30 - 5:00)

**Concept:** Reframing the Problem

**Visual - The Mental Shift:**
```
[SPLIT SCREEN]

LEFT SIDE (Old Thinking):
"For each number, search for its partner"
15 → search [85, 40, 20, 60] for 85
85 → search [40, 20, 60] for 15

RIGHT SIDE (New Thinking):
"For each number, ASK: have I seen its partner before?"
Target = 100

See 15 → Need 85 → Have I seen 85? No → Remember 15
See 85 → Need 15 → Have I seen 15? YES!
```

**Script:**
```
NARRATOR: "Here's the insight that changes everything. Stop searching. Start remembering."

[ANIMATION: Two approaches side by side]

NARRATOR: "In brute force, every time we pick a number, we search the rest of the array for its partner. That search is what's killing us."

[HIGHLIGHT: "Search" crossed out]

NARRATOR: "But what if we didn't have to search? What if we already knew what we'd seen before?"

[NEW APPROACH ANIMATES]

NARRATOR: "Here's the trick. As we walk through the array, we calculate what partner we NEED. If I'm looking at 15 and the target is 100, I need 85."

[100 - 15 = 85 appears]

NARRATOR: "Then we ask one simple question: Have I seen 85 already?"

[QUESTION MARK]

NARRATOR: "If yes - we're done. If no - we REMEMBER that we saw 15, and move on."

[15 gets stored in a box labeled "Seen"]

NARRATOR: "We're building a memory of everything we've seen. A lookup table. In code, this is called a Hash Map."
```

---

### Segment 4: What is a Hash Map? (5:00 - 6:30)

**Concept:** Hash Map Basics for Beginners

**Visual:**
```
[HASH MAP VISUALIZATION]

A Hash Map is like a filing cabinet with instant access.

KEY         VALUE
-----------------
15    →      0      (value 15 is at index 0)
85    →      1      (value 85 is at index 1)
40    →      2      (value 40 is at index 2)

LOOKUP: "Do you have 85?"
Answer: Yes! It's at index 1
Time: INSTANT (doesn't matter how big the cabinet is)
```

**Script:**
```
NARRATOR: "Quick primer on Hash Maps. Think of it like a filing cabinet, but magic."

[FILING CABINET ANIMATION]

NARRATOR: "In a normal cabinet, you might search through every folder to find what you want. But a hash map uses a trick - it calculates EXACTLY where to put things and where to find them."

[ANIMATION: Number goes through hash function, lands in specific slot]

NARRATOR: "When we store '15 is at index 0', the hash map remembers it. Later, when we ask 'have you seen 15?' - it doesn't search. It goes directly to the answer."

[COMPARISON]

Array search: Check every item → O(n)
Hash Map lookup: Direct access → O(1)

NARRATOR: "O(1) means constant time. It takes the same amount of time whether you have 10 items or 10 million."

[BEAT]

NARRATOR: "This is why hash maps are everywhere in programming. When you need fast lookups, this is your weapon."
```

---

### Segment 5: The Optimal Solution (6:30 - 8:30)

**Concept:** One-Pass Hash Map Solution

**Code (build it up piece by piece):**

```javascript
function twoSum(prices, target) {
  // Our memory - stores value → index
  const seen = {};

  // Walk through each price
  for (let i = 0; i < prices.length; i++) {
    const currentPrice = prices[i];

    // What partner do we need?
    const partnerNeeded = target - currentPrice;

    // Have we seen that partner before?
    if (partnerNeeded in seen) {
      // YES! Return both indices
      return [seen[partnerNeeded], i];
    }

    // NO - Remember this price and where we saw it
    seen[currentPrice] = i;
  }
}
```

**Step-by-Step Walkthrough Visual:**

```
prices = [15, 85, 40, 20, 60]
target = 100
seen = {}

---

STEP 1: i=0, currentPrice=15
Partner needed: 100 - 15 = 85
Is 85 in seen? NO (seen is empty)
Remember: seen = {15: 0}

---

STEP 2: i=1, currentPrice=85
Partner needed: 100 - 85 = 15
Is 15 in seen? YES! (seen[15] = 0)
RETURN [0, 1]

---

DONE in 2 steps!
Brute force would check: 15+85, 15+40, 15+20, 15+60, 85+40...
We found it immediately because we REMEMBERED.
```

**Script:**
```
[CODE APPEARS EMPTY]

NARRATOR: "Let's build this solution piece by piece."

[LINE 1: const seen = {}]

NARRATOR: "First, create our memory - an empty hash map. This will store 'value maps to index'."

[LINE 2-3: the for loop]

NARRATOR: "Now walk through the array, one item at a time."

[LINE 4-5: currentPrice and partnerNeeded]

NARRATOR: "For each price, calculate what partner we need. Current price is 15. Target is 100. So we need 85."

[LINE 6-8: the if check and return]

NARRATOR: "Now the key question: Have we seen 85 before? Check the hash map. If yes, we're done - return both indices."

[LINE 9-10: storing in seen]

NARRATOR: "If no, store this price in our memory. 'I saw 15 at index 0.' Then move on."

[FULL WALKTHROUGH ANIMATION]

NARRATOR: "Watch it run. Index 0, price 15, need 85. Not in memory. Store 15. Index 1, price 85, need 15. IS 15 in memory? Yes! We stored it last step."

[RESULT APPEARS: [0, 1]]

NARRATOR: "Two steps. Done."
```

---

### Segment 6: The Complexity Trade-off (8:30 - 9:15)

**Concept:** Time vs Space

```
| Approach    | Time   | Space  |
|-------------|--------|--------|
| Brute Force | O(n²)  | O(1)   |
| Hash Map    | O(n)   | O(n)   |
```

**Script:**
```
NARRATOR: "Let's talk trade-offs."

[TABLE APPEARS]

NARRATOR: "Brute force uses almost no extra memory - just a couple of loop variables. But it's slow. Quadratic time."

NARRATOR: "The hash map approach uses extra memory - in the worst case, we store every item before finding our pair. That's O(n) space."

NARRATOR: "But we only loop through the array ONCE. O(n) time."

[VISUAL: Memory icon grows, Clock icon shrinks]

NARRATOR: "We traded space for speed. Almost always worth it. Memory is cheap. Time is not."
```

---

## Resolution & Transition (9:15 - 10:00)

### Success
```
[SCREEN: Player selects Burner SIM ($15) + Fake Passport ($85)]
[CART TOTAL: $100.00]
[CHECKOUT BUTTON: GLOWING]

[CLICK]

GATEKEEPER: "Verification complete. Welcome to the Shadow Market."

[STOREFRONT UNLOCKS - Full access]
[CREDITS ADDED: 0 → 100]

NARRATOR: "You're in. And you've just learned the most famous coding problem in existence."

[SMALL TEXT: "LeetCode #1 - Two Sum - 67% acceptance rate"]

NARRATOR: "But having access doesn't mean you have power. You need credits. And the Gatekeeper just gave you a hint..."

[POPUP APPEARS]
SYSTEM MESSAGE: "Admin Console detected. Refund mode: IN PROGRESS"
PATCH NOTES: "Known bug: duplicate refunds not yet patched"

NARRATOR: "...there's always a glitch to exploit."

[FADE TO: "SCENARIO 2: THE INFINITE MONEY GLITCH"]
```

---

## UI/Visual Assets Needed

### Shadow Market Storefront
- [ ] Neon cyberpunk aesthetic
- [ ] Grid of items with price tags
- [ ] Hover states showing item details
- [ ] Cart system showing running total
- [ ] "ACCESS DENIED" overlay for locked state

### Gatekeeper Interface
- [ ] Bot verification prompt
- [ ] Target amount display: "$100.00"
- [ ] Countdown timer (adds tension)
- [ ] Success/failure feedback animations

### Code Walkthrough Overlays
- [ ] Syntax-highlighted code panel
- [ ] Variable state tracker (show `seen` hash map contents)
- [ ] Current line indicator
- [ ] Step counter

### Algorithm Visualizations
- [ ] Nested loop comparison grid
- [ ] Hash map bucket animation
- [ ] Side-by-side: brute force vs hash map race
- [ ] Big O growth chart (n vs n²)

---

## B-Roll / Supplementary Footage

- [ ] Slow pan across price list (give viewer time to try themselves)
- [ ] Hash map "filing cabinet" metaphor animation
- [ ] Comparison counter incrementing (brute force)
- [ ] Numbers flying into hash map buckets
- [ ] Split screen race: O(n) vs O(n²) with large input
- [ ] "Welcome" unlock animation

---

## Audio Notes

### Music
- Mysterious/tense on storefront reveal
- Thinking/puzzle music during problem explanation
- Building intensity during brute force (showing it's slow)
- "Aha" moment musical sting when hash map insight hits
- Triumphant but subtle on unlock

### SFX
- Browser loading sounds
- Access denied buzz
- Cash register / price sounds
- Typing for code appearing
- Hash map "slot" sound (satisfying click)
- Success chime on entry

---

## Interactive Challenge (If Applicable)

### Player Input
```
Given: prices = [25, 50, 75, 25]
Target: 100

Find TWO indices that add up to 100.

Your code:
_______________
```

### Test Cases
1. `[2, 7, 11, 15], target=9` → `[0, 1]`
2. `[3, 2, 4], target=6` → `[1, 2]`
3. `[3, 3], target=6` → `[0, 1]`
4. `[1, 2, 3, 4, 5], target=9` → `[3, 4]`

### Hints (Progressive)
1. "What number would you need to pair with the first item?"
2. "Instead of searching for the partner, what if you remembered what you've seen?"
3. "A hash map lets you check 'have I seen X?' instantly..."

---

## Common Mistakes to Address

### Mistake 1: Using the same element twice
```javascript
// WRONG - checking if nums[i] + nums[i] = target
if (currentPrice + currentPrice === target)

// This would return [0, 0] for [50, ...] with target 100
// But we need TWO DIFFERENT items!
```
**Solution:** Only check against PREVIOUSLY seen items, not the current one.

### Mistake 2: Returning values instead of indices
```javascript
// WRONG
return [15, 85];

// RIGHT
return [0, 1];
```
**The problem asks for positions, not the numbers themselves.**

### Mistake 3: Adding to hash map before checking
```javascript
// WRONG ORDER
seen[currentPrice] = i;  // Store first
if (partnerNeeded in seen)  // Then check

// This would fail for [3, 3] with target 6
// It would find the SAME 3 as its own partner!

// RIGHT ORDER
if (partnerNeeded in seen)  // Check first
seen[currentPrice] = i;  // Then store
```

---

## Continuity Notes

### This is Scenario 1 - The Beginning
- Player discovers the Shadow Market
- First exposure to the store interface
- Learns that access requires solving puzzles
- Earns first credits

### Setup for Scenario 2
- Player sees "Admin Console" hint
- Patch notes mention broken refund system
- Credits balance visible (creates desire for more)
- Seeds the "exploit" mindset

---

## Production Checklist

- [ ] Write final narration script (this doc is the rough draft)
- [ ] Design Shadow Market storefront mockup
- [ ] Create Gatekeeper verification UI
- [ ] Build hash map visualization animation
- [ ] Record code walkthrough footage
- [ ] Create Big O comparison charts
- [ ] Design price list with thematic items
- [ ] Source/create audio assets
- [ ] Build interactive challenge (if web-based)
- [ ] Record final video
- [ ] Edit with graphics/overlays
- [ ] Add captions

---

## Notes & Ideas

- The prices list could randomize each time, making it replayable
- Consider having the Gatekeeper speak in cryptic/ominous fragments
- Easter egg: If player takes too long, Gatekeeper could say "Processing... are you a bot?"
- The $100 target is satisfying - easy to verify mentally
- Could add a "hard mode" with negative numbers for advanced viewers
- The fake product names (Burner SIM, Fake Passport) add worldbuilding without being actually dangerous
- Callback opportunity: Later scenarios could reference "the Two Sum that got you in"

---

## Pacing Notes (for the "go slow" request)

### Key moments to let breathe:
1. **The price list reveal** (0:30) - Give 5+ seconds for viewer to scan
2. **The problem statement** (1:00) - Read it twice, maybe three times
3. **The brute force grid** (2:30) - Let the growing numbers sink in
4. **The insight moment** (4:00) - This is the "aha" - dramatic pause
5. **Hash map explanation** (5:30) - Don't rush the filing cabinet metaphor
6. **The walkthrough** (7:00) - Step through EVERY iteration, show the hash map updating

### Suggested runtime: 9-10 minutes
This is longer than typical "LeetCode explanation" videos, but the goal is understanding, not speed.

