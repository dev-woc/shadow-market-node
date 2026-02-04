# Act 1 - The Infiltration

> Scenarios 1-5: Breaking in, getting rich, and finding the Shadow Market.

---

## The Story Arc

You're a rogue developer who discovered a vulnerability in a major e-commerce platform. Your goal: exploit it, get rich, and disappear into the Shadow Market before anyone notices.

---

## Scenario Breakdown

### 1. The Gatekeeper (Entry Point)
**LeetCode:** Two Sum | **Concept:** Hash Map

**Story:**
The Admin Console requires a verification purchase. You have a $100 burner gift card. To unlock access, your cart must total *exactly* $100. Find two items that sum to the target.

**The Code Challenge:**
```
Input: prices = [25, 50, 75, 10, 90], target = 100
Output: [0, 2] // items at index 0 ($25) + index 2 ($75) = $100
```

**Teaching Points:**
- Brute force O(n²) vs Hash Map O(n)
- Why we store complements

**Success Flow → Transition to Scenario 2:**
1. User purchases correct 2 items (sum = target)
2. **Popup:** "ADMIN MODE ACCESSED"
3. **Next page:** Dev Update Patch Notes
   - Various vague update notes...
   - "Fixed cart overflow bug"
   - "Updated user permissions"
   - **"Refund Mode still in progress"** ← *This is the hint*
   - "Security audit scheduled for next sprint"

> The bolded "Refund Mode still in progress" plants the seed for the next exploit.

---

### 2. The Infinite Money Glitch (The Exploit)
**LeetCode:** Contains Duplicate | **Concept:** Hash Set | [[Scenario 2 - Infinite Money Glitch Production|Production Doc]]

**Story:**
You're in the Admin Console. You discover the "Refund" button is broken - clicking it twice creates duplicate credits. You spam it. Now you have 1,000,000 dirty credits. But wait - the system logs everything. Check if your transaction list contains duplicates before the audit bot runs.

**The Code Challenge:**
```
Input: transactions = [100, 200, 100, 300]
Output: true // 100 appears twice - you're exposed!
```

**Teaching Points:**
- Set for O(1) lookup
- Early exit optimization

---

### 3. The Wash (Laundering)
**LeetCode:** Best Time to Buy and Sell Stock | **Concept:** Sliding Window / Kadane's

**Story:**
Dirty credits are flagged. To clean them, you need to buy a rare item at its lowest and sell at its peak. You have the price history. Execute one perfect trade.

**The Code Challenge:**
```
Input: prices = [7, 1, 5, 3, 6, 4]
Output: 5 // Buy at 1, sell at 6
```

**Teaching Points:**
- Track minimum so far
- Single pass solution
- Why you can't just find min and max separately

---

### 4. The Bot Swarm (Influence)
**LeetCode:** Majority Element | **Concept:** Boyer-Moore Voting

**Story:**
The Shadow Market only accepts "Verified Sellers." To get verified, you need to win "Seller of the Month." You deployed a bot swarm to vote for yourself. Verify that your bots are the *majority* (>50%) of all votes.

**The Code Challenge:**
```
Input: votes = ["you", "them", "you", "you", "other"]
Output: "you" // 3/5 = 60% majority
```

**Teaching Points:**
- Boyer-Moore voting algorithm
- O(1) space solution
- Why this works mathematically

---

### 5. The Secret Knock (Access Granted)
**LeetCode:** Valid Palindrome | **Concept:** Two Pointers

**Story:**
You won. Now you stand before the Shadow Market entrance. The door has a cryptic input: "A man, a plan, a canal: Panama". The system checks if it reads the same forwards and backwards (ignoring spaces and punctuation). Enter the palindrome to unlock.

**The Code Challenge:**
```
Input: "A man, a plan, a canal: Panama"
Output: true // "amanaplanacanalpanama" is a palindrome
```

**Teaching Points:**
- Two pointer technique
- Character filtering (alphanumeric only)
- Case normalization

---

## Act 1 Finale

> The Shadow Market doors swing open. You're inside. But you're not alone - and the real game is just beginning.

**Transition to:** [[Act 2 - The Expansion]]

---

## Production Checklist
- [ ] Script all 5 scenario narratives
- [ ] Build store features (see [[Vulnerable Store Tech Spec]])
- [ ] Record video content
- [ ] Create interactive challenges

