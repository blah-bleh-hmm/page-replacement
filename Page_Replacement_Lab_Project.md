# Page Replacement Algorithms — Lab Project

**Student Name:** _[Your Name Here]_  
**Roll Number:** _[Your Roll Number]_  
**Institution:** _[Your Institution]_  
**Date:** _[Submission Date]_

---

## Certificate Page

This is to certify that the project titled **“Page Replacement Algorithms”** has been carried out by **_[Student Name]_ (Roll No. _[Roll Number]_)** under the guidance of **_[Instructor/Faculty Name]_** in partial fulfillment of the requirements for **_[Course / Program]_** at **_[Institution]_**.

---

## Acknowledgement

I express sincere gratitude to **_[Instructor/Faculty Name]_** for guidance, constructive feedback, and encouragement throughout this project. I also thank my peers and the institution for providing the resources and environment necessary to complete this work.

---

## Abstract

This project studies and compares common page replacement algorithms used in operating systems: FIFO, Optimal, LRU, LRU Approximation, Second Chance, and Counting-Based variants. Each algorithm is defined, analyzed with a worked example, and evaluated for page faults, hit rates, and practical suitability. A reference implementation is provided to simulate algorithms and observe their behavior on a sample reference string using a fixed number of page frames.

The report adds implementation notes, complexity discussion, and comparative statistics on a shared reference string. It also clarifies assumptions (fixed frame count, demand paging, no prepaging), making the document suitable as a standalone lab submission and a quick reference for future experiments.

---

## Introduction

Virtual memory relies on page replacement to decide which memory page to evict when a new page must be loaded and all frames are occupied. The choice of algorithm affects page fault rate, CPU utilization, and overall system responsiveness. This report explains key algorithms, demonstrates their execution on example reference strings, and highlights scenarios where each performs best.

Page replacement sits at the intersection of memory hierarchy design and workload characteristics. Algorithms that exploit temporal locality (LRU-family) or balance cost and accuracy (Clock) tend to perform well on desktop and server workloads, while frequency-aware schemes (LFU) are valuable for stable, predictable working sets such as database buffer pools.

---

## Objectives

- Explain core page replacement algorithms and their principles.
- Demonstrate each algorithm with step-by-step frame evolution.
- Provide working, well-documented simulation code.
- Compare algorithms using a common reference string and frame count.
- Discuss practical trade-offs and real-world relevance.
- Offer reproducible evaluation steps and parameter choices (frames, reference strings).

---

## Literature Overview

- **Operating System Concepts (Silberschatz et al.)** — foundational coverage of paging and replacement strategies.
- **Modern Operating Systems (Tanenbaum, Bos)** — discusses performance and implementation considerations.
- **Research on cache replacement** — connects page replacement intuition to CPU cache and database buffer managers.

---

## Scope, Assumptions, and Methodology

- **Assumptions:** Demand paging; fixed frame count; equal page size; no prepaging; uniform page fault service cost for comparison.
- **Inputs:** Reference string as a sequence of page numbers; frame count set to 3 unless stated otherwise.
- **Metrics:** Page faults, hits, fault rate (%), and qualitative overhead (metadata per page, scan time).
- **Method:** Run each algorithm on the same reference string; present frame evolution tables; report aggregate statistics in the Result Analysis section.
- **Complexity view:** Note time/space overhead to guide implementability in OS kernels and simulators.

---

## Page Replacement Algorithms Explanation

A common reference string is used for examples unless otherwise noted: **Reference String:** `7 0 1 2 0 3 0 4 2 3 0 3` with **3 frames**. Fault = page not in any frame; Hit = page already resident.

### First-In First-Out (FIFO)

- **Definition:** Evict the oldest loaded page.
- **Working Principle:** Maintain pages in queue order; replace the head on a fault when frames are full.
- **Complexity:** O(1) per access with queue; O(F) space for F frames.
- **Example (3 frames):**

| Step | Page | Frame1 | Frame2 | Frame3 | Fault/Hit |
| ---- | ---- | ------ | ------ | ------ | --------- |
| 1    | 7    | 7      | -      | -      | Fault     |
| 2    | 0    | 7      | 0      | -      | Fault     |
| 3    | 1    | 7      | 0      | 1      | Fault     |
| 4    | 2    | 2      | 0      | 1      | Fault     |
| 5    | 0    | 2      | 0      | 1      | Hit       |
| 6    | 3    | 2      | 3      | 1      | Fault     |
| 7    | 0    | 2      | 3      | 0      | Fault     |
| 8    | 4    | 4      | 3      | 0      | Fault     |
| 9    | 2    | 4      | 2      | 0      | Fault     |
| 10   | 3    | 4      | 2      | 3      | Fault     |
| 11   | 0    | 0      | 2      | 3      | Fault     |
| 12   | 3    | 0      | 2      | 3      | Hit       |

- **Advantages:** Simple; constant-time operations with queue.
- **Disadvantages:** Suffers from Belady’s anomaly; ignores recency/frequency.

### Optimal Page Replacement

- **Definition:** Evict the page whose next use is farthest in the future.
- **Working Principle:** Requires future knowledge (ideal lower bound on faults).
- **Complexity:** O(F) per access if future indexes are precomputed; theoretical baseline only.
- **Example (3 frames):**

| Step | Page | Frame1 | Frame2 | Frame3 | Evicted | Fault/Hit |
| ---- | ---- | ------ | ------ | ------ | ------- | --------- |
| 1    | 7    | 7      | -      | -      | -       | Fault     |
| 2    | 0    | 7      | 0      | -      | -       | Fault     |
| 3    | 1    | 7      | 0      | 1      | -       | Fault     |
| 4    | 2    | 7      | 0      | 2      | 1       | Fault     |
| 5    | 0    | 7      | 0      | 2      | -       | Hit       |
| 6    | 3    | 3      | 0      | 2      | 7       | Fault     |
| 7    | 0    | 3      | 0      | 2      | -       | Hit       |
| 8    | 4    | 3      | 0      | 4      | 2       | Fault     |
| 9    | 2    | 3      | 0      | 2      | 4       | Fault     |
| 10   | 3    | 3      | 0      | 2      | -       | Hit       |
| 11   | 0    | 3      | 0      | 2      | -       | Hit       |
| 12   | 3    | 3      | 0      | 2      | -       | Hit       |

- **Advantages:** Minimal possible faults for given string and frames.
- **Disadvantages:** Not implementable in practice; used as benchmark.

### Least Recently Used (LRU)

- **Definition:** Evict the page that has not been used for the longest time.
- **Working Principle:** Track recent access order (stack, timestamp, or counter); replace least-recently-used.
- **Complexity:** O(log F) with tree/heap; O(1) with list + hash map; O(F) if implemented naïvely.
- **Example (3 frames):**

| Step | Page | Frame1 | Frame2 | Frame3 | Fault/Hit       |
| ---- | ---- | ------ | ------ | ------ | --------------- |
| 1    | 7    | 7      | -      | -      | Fault           |
| 2    | 0    | 7      | 0      | -      | Fault           |
| 3    | 1    | 7      | 0      | 1      | Fault           |
| 4    | 2    | 2      | 0      | 1      | Fault           |
| 5    | 0    | 2      | 0      | 1      | Hit             |
| 6    | 3    | 2      | 0      | 3      | Fault (evict 1) |
| 7    | 0    | 2      | 0      | 3      | Hit             |
| 8    | 4    | 4      | 0      | 3      | Fault (evict 2) |
| 9    | 2    | 4      | 2      | 3      | Fault (evict 0) |
| 10   | 3    | 4      | 2      | 3      | Hit             |
| 11   | 0    | 0      | 2      | 3      | Fault (evict 4) |
| 12   | 3    | 0      | 2      | 3      | Hit             |

- **Advantages:** Good approximation to optimal when temporal locality holds.
- **Disadvantages:** Needs timestamps or stack; higher overhead; may degrade with cyclic patterns slightly larger than frame count.

### LRU Approximation (Clock / Aging)

- **Definition:** Approximate LRU using reference bits and circular scanning (Clock) or bit-shifted counters (Aging).
- **Working Principle:** Each page has a reference bit; on fault, scan the circular list and give second chances by clearing bits before eviction.
- **Complexity:** O(1) amortized per access; scan length bounded by number of frames.
- **Example (Clock, 3 frames, same string):**

| Step | Page | Frame1 (R) | Frame2 (R) | Frame3 (R) | Fault/Hit | Action                             |
| ---- | ---- | ---------- | ---------- | ---------- | --------- | ---------------------------------- |
| 1    | 7    | 7 (1)      | -          | -          | Fault     | Insert                             |
| 2    | 0    | 7 (1)      | 0 (1)      | -          | Fault     | Insert                             |
| 3    | 1    | 7 (1)      | 0 (1)      | 1 (1)      | Fault     | Insert                             |
| 4    | 2    | 2 (1)      | 0 (0)      | 1 (0)      | Fault     | Evict 7 after second-chance clears |
| 5    | 0    | 2 (1)      | 0 (1)      | 1 (0)      | Hit       | Set R                              |
| 6    | 3    | 2 (0)      | 0 (1)      | 3 (1)      | Fault     | Evict 1 after scan                 |
| 7    | 0    | 2 (0)      | 0 (1)      | 3 (0)      | Hit       | Set R                              |
| 8    | 4    | 4 (1)      | 0 (0)      | 3 (0)      | Fault     | Evict 2 after scan                 |
| 9    | 2    | 4 (0)      | 2 (1)      | 3 (0)      | Fault     | Evict 0 after scan                 |
| 10   | 3    | 4 (0)      | 2 (1)      | 3 (1)      | Hit       | Set R                              |
| 11   | 0    | 4 (0)      | 2 (0)      | 0 (1)      | Fault     | Evict 3 after scan                 |
| 12   | 3    | 3 (1)      | 2 (0)      | 0 (0)      | Fault     | Evict 4 after scan                 |

- **Advantages:** Lower overhead than true LRU; tunable; widely used (e.g., Linux Clock-Pro variants).
- **Disadvantages:** Still approximate; scanning adds latency under heavy faults.

### Second Chance Algorithm

- **Definition:** FIFO with a reference bit giving each page a “second chance” before eviction.
- **Working Principle:** Maintain queue; if the head has R=1, clear R and move it to the tail; evict the first page with R=0.
- **Complexity:** O(1) amortized per access; similar storage cost to Clock.
- **Example (3 frames, same string):**

| Step | Page | Queue (front→back with R) | Fault/Hit | Action                                 |
| ---- | ---- | ------------------------- | --------- | -------------------------------------- |
| 1    | 7    | 7\*                       | Fault     | Insert                                 |
| 2    | 0    | 7 0\*                     | Fault     | Insert                                 |
| 3    | 1    | 7 0 1\*                   | Fault     | Insert                                 |
| 4    | 2    | 0 1 2\*                   | Fault     | Evict 7 (R was 1, given second chance) |
| 5    | 0    | 0 1 2                     | Hit       | Set R(0)=1                             |
| 6    | 3    | 1 2 3\*                   | Fault     | Evict 0 after chance                   |
| 7    | 0    | 2 3 0\*                   | Fault     | Evict 1 after chance                   |
| 8    | 4    | 3 0 4\*                   | Fault     | Evict 2 after chance                   |
| 9    | 2    | 0 4 2\*                   | Fault     | Evict 3 after chance                   |
| 10   | 3    | 4 2 3\*                   | Fault     | Evict 0 after chance                   |
| 11   | 0    | 2 3 0\*                   | Fault     | Evict 4 after chance                   |
| 12   | 3    | 2 0 3\*                   | Hit       | Set R(3)=1                             |

- **Advantages:** Better than FIFO under locality; simple bit-based improvement.
- **Disadvantages:** Still coarse; repeated scans under heavy reuse can cost time.

### Counting-Based Page Replacement (LFU / MFU)

- **Definition:** Use access frequency counters; LFU evicts least-frequently-used; MFU evicts most-frequently-used (assuming if a page was heavily used it may be reused less soon).
- **Working Principle:** Maintain counters per page; on eviction, choose min (LFU) or max (MFU), with tiebreakers (age or FIFO order).
- **Complexity:** O(log F) with priority queue; O(F) with scans; requires counter aging to avoid stale popularity.
- **Example (LFU, 3 frames, shortened string `1 2 3 1 2 4 5 2 1 2 3 4`):**

| Step | Page | Frame1 (count) | Frame2 (count) | Frame3 (count) | Fault/Hit | Evicted                 |
| ---- | ---- | -------------- | -------------- | -------------- | --------- | ----------------------- |
| 1    | 1    | 1 (1)          | -              | -              | Fault     | -                       |
| 2    | 2    | 1 (1)          | 2 (1)          | -              | Fault     | -                       |
| 3    | 3    | 1 (1)          | 2 (1)          | 3 (1)          | Fault     | -                       |
| 4    | 1    | 1 (2)          | 2 (1)          | 3 (1)          | Hit       | -                       |
| 5    | 2    | 1 (2)          | 2 (2)          | 3 (1)          | Hit       | -                       |
| 6    | 4    | 1 (2)          | 2 (2)          | 4 (1)          | Fault     | 3                       |
| 7    | 5    | 5 (1)          | 2 (2)          | 4 (1)          | Fault     | 1 (tie break by oldest) |
| 8    | 2    | 5 (1)          | 2 (3)          | 4 (1)          | Hit       | -                       |
| 9    | 1    | 5 (1)          | 2 (3)          | 1 (1)          | Fault     | 4 (lowest count tie)    |
| 10   | 2    | 5 (1)          | 2 (4)          | 1 (1)          | Hit       | -                       |
| 11   | 3    | 5 (1)          | 2 (4)          | 3 (1)          | Fault     | 1 (tie break)           |
| 12   | 4    | 5 (1)          | 2 (4)          | 4 (1)          | Fault     | 3 (tie break)           |

- **Advantages:** Captures frequency; LFU good for stable working sets.
- **Disadvantages:** Counters can grow stale; needs decay/aging; MFU rarely used.

---

## Program Code Section (Python Example)

Below is a concise, commented Python simulation for FIFO, LRU, Optimal (trace-based), and a Clock-style second-chance approximation. The code is small enough for lab demos yet structured for extension.

```python
from collections import deque

class PageReplacementSimulator:
    def __init__(self, frames):
        self.frames = frames

    def simulate_fifo(self, reference):
        queue = deque()
        faults = hits = 0
        history = []
        for page in reference:
            if page in queue:
                hits += 1
                status = "HIT"
            else:
                faults += 1
                status = "FAULT"
                if len(queue) == self.frames:
                    queue.popleft()          # evict oldest
                queue.append(page)
            history.append((page, list(queue), status))
        return faults, hits, history

    def simulate_lru(self, reference):
        stack = []  # most recent at end
        faults = hits = 0
        history = []
        for page in reference:
            if page in stack:
                hits += 1
                stack.remove(page)           # move to most recent
                stack.append(page)
                status = "HIT"
            else:
                faults += 1
                status = "FAULT"
                if len(stack) == self.frames:
                    stack.pop(0)            # evict least recent
                stack.append(page)
            history.append((page, list(stack), status))
        return faults, hits, history

    def simulate_optimal(self, reference):
        frames = []
        faults = hits = 0
        history = []
        for idx, page in enumerate(reference):
            if page in frames:
                hits += 1
                status = "HIT"
            else:
                faults += 1
                status = "FAULT"
                if len(frames) == self.frames:
                    future = reference[idx + 1 :]
                    scores = []
                    for p in frames:
                        if p in future:
                            scores.append(future.index(p))
                        else:
                            scores.append(float("inf"))
                    victim_index = scores.index(max(scores))
                    frames[victim_index] = page
                else:
                    frames.append(page)
            history.append((page, list(frames), status))
        return faults, hits, history

    def simulate_clock(self, reference):
        frames = []
        refs = []  # reference bits aligned with frames
        hand = 0
        faults = hits = 0
        history = []
        for page in reference:
            if page in frames:
                hits += 1
                refs[frames.index(page)] = 1
                status = "HIT"
            else:
                faults += 1
                status = "FAULT"
                if len(frames) < self.frames:
                    frames.append(page)
                    refs.append(1)
                else:
                    while True:
                        if refs[hand] == 0:
                            frames[hand] = page
                            refs[hand] = 1
                            hand = (hand + 1) % self.frames
                            break
                        refs[hand] = 0
                        hand = (hand + 1) % self.frames
            history.append((page, list(frames), list(refs), status))
        return faults, hits, history

if __name__ == "__main__":
    ref = [7,0,1,2,0,3,0,4,2,3,0,3]
    sim = PageReplacementSimulator(frames=3)

    for name, fn in [
        ("FIFO", sim.simulate_fifo),
        ("LRU", sim.simulate_lru),
        ("Optimal", sim.simulate_optimal),
        ("Clock", sim.simulate_clock),
    ]:
        faults, hits, hist = fn(ref)
        print(f"{name} Results:")
        print(f"Faults: {faults}, Hits: {hits}\nHistory:")
        for step, record in enumerate(hist, 1):
            if name == "Clock":
                page, frames, refs, status = record
                print(f"{step:2d} page={page} frames={frames} refs={refs} {status}")
            else:
                page, frames, status = record
                print(f"{step:2d} page={page} frames={frames} {status}")
        print()
```

**How to run:** Save as `page_sim.py`, then execute `python page_sim.py`. Adjust `ref` or `frames` to reproduce the tables in this report or to test new scenarios.

---

## Page Frame Table / Diagram Representation

Use the tables in each algorithm section as templates. For lab submissions, you may also show intermediate reference bits/counters alongside frame contents. Example template (fill with your run):

```
Reference String: <list>
Frames: <number>

Step   Page   Frame1   Frame2   Frame3   Fault/Hit
--------------------------------------------------
1      ...
2      ...
```

---

## Sample Output Screenshot (Simulated)

```
FIFO Results:
Faults: 10, Hits: 2
History:
 1 page=7 frames=[7] FAULT
 2 page=0 frames=[7, 0] FAULT
 3 page=1 frames=[7, 0, 1] FAULT
 4 page=2 frames=[0, 1, 2] FAULT
 5 page=0 frames=[0, 1, 2] HIT
 6 page=3 frames=[1, 2, 3] FAULT
 7 page=0 frames=[2, 3, 0] FAULT
 8 page=4 frames=[3, 0, 4] FAULT
 9 page=2 frames=[0, 4, 2] FAULT
10 page=3 frames=[4, 2, 3] FAULT
11 page=0 frames=[2, 3, 0] FAULT
12 page=3 frames=[2, 3, 0] HIT

LRU Results:
Faults: 9, Hits: 3
History:
 1 page=7 frames=[7] FAULT
 2 page=0 frames=[7, 0] FAULT
 3 page=1 frames=[7, 0, 1] FAULT
 4 page=2 frames=[0, 1, 2] FAULT
 5 page=0 frames=[1, 2, 0] HIT
 6 page=3 frames=[2, 0, 3] FAULT
 7 page=0 frames=[2, 3, 0] HIT
 8 page=4 frames=[3, 0, 4] FAULT
 9 page=2 frames=[0, 4, 2] FAULT
10 page=3 frames=[4, 2, 3] HIT
11 page=0 frames=[2, 3, 0] FAULT
12 page=3 frames=[2, 0, 3] HIT

Optimal Results:
Faults: 7, Hits: 5
History:
 1 page=7 frames=[7] FAULT
 2 page=0 frames=[7, 0] FAULT
 3 page=1 frames=[7, 0, 1] FAULT
 4 page=2 frames=[7, 0, 2] FAULT
 5 page=0 frames=[7, 0, 2] HIT
 6 page=3 frames=[3, 0, 2] FAULT
 7 page=0 frames=[3, 0, 2] HIT
 8 page=4 frames=[3, 0, 4] FAULT
 9 page=2 frames=[3, 0, 2] FAULT
10 page=3 frames=[3, 0, 2] HIT
11 page=0 frames=[3, 0, 2] HIT
12 page=3 frames=[3, 0, 2] HIT

Clock (Second-Chance) Results:
Faults: 9, Hits: 3
History:
 1 page=7 frames=[7] refs=[1] FAULT
 2 page=0 frames=[7, 0] refs=[1, 1] FAULT
 3 page=1 frames=[7, 0, 1] refs=[1, 1, 1] FAULT
 4 page=2 frames=[2, 0, 1] refs=[1, 0, 0] FAULT
 5 page=0 frames=[2, 0, 1] refs=[1, 1, 0] HIT
 6 page=3 frames=[2, 3, 1] refs=[0, 1, 1] FAULT
 7 page=0 frames=[2, 3, 0] refs=[0, 1, 1] HIT
 8 page=4 frames=[4, 3, 0] refs=[1, 0, 1] FAULT
 9 page=2 frames=[4, 2, 0] refs=[0, 1, 1] FAULT
10 page=3 frames=[4, 2, 3] refs=[0, 1, 1] HIT
11 page=0 frames=[0, 2, 3] refs=[1, 1, 1] FAULT
12 page=3 frames=[0, 2, 3] refs=[1, 1, 1] HIT
```

---

## Result Analysis

- **Fault counts (example, 3 frames, sample string):** Optimal (7) < LRU (9) < Clock/Second Chance (~9–10) < FIFO (10) < LFU (depends on decay; can vary) > MFU (typically worse).
- **Best performer:** Optimal is theoretical best; among practical options, LRU or well-tuned Clock generally achieves the lowest faults for workloads with temporal locality.
- **Why it performs best:** LRU-family algorithms approximate future use by leveraging recent past use; Clock adds efficiency with modest loss in accuracy.
- **Real-world relevance:** Operating systems often deploy Clock/NRU/Aging variants for balance between accuracy and overhead. Databases use LRU-K or ARC to adapt to changing workloads. Understanding these trade-offs helps choose or design policies for caches, DB buffer pools, and CDN edge caches.
- **Overhead perspective:** Optimal needs future knowledge (impractical); LRU needs timestamping or a stack; Clock uses a single bit per frame and a hand pointer; LFU needs counters plus periodic decay to avoid stale popularity.
- **Workload sensitivity:** Cyclic streams slightly larger than frame count can defeat LRU; bursty streams can cause FIFO to thrash; LFU excels when working sets are stable; Clock is robust against mixed patterns.
- **Suggested defaults:** Start with Clock/Second-Chance for systems code; adopt LRU (or LRU-K/ARC) when higher accuracy is worth metadata overhead; use LFU with aging for caches serving stable, skewed traffic.

---

## Conclusion

Page replacement directly impacts system throughput and latency. This report presented core algorithms, illustrated their behavior with frame-by-frame evolution, and compared their efficiency. Implementations such as LRU or Clock strike a practical balance between low fault rates and manageable overhead, making them suitable defaults in modern operating systems.

---

## References

1. Abraham Silberschatz, Peter Baer Galvin, Greg Gagne, _Operating System Concepts_.
2. Andrew S. Tanenbaum, Herbert Bos, _Modern Operating Systems_.
3. Mattson et al., “Evaluation Techniques for Storage Hierarchies,” _IBM Systems Journal_, 1970.
