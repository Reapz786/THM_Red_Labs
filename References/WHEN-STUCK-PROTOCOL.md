# WHEN STUCK PROTOCOL

> **Pin this file to your Obsidian sidebar. Keep it open in a split pane during every challenge room.**

---

## 🚨 THE 30-MINUTE RULE (NON-NEGOTIABLE)

When you hit a blocker, you MUST follow this sequence. No skipping steps.

### **Timer Setup (Do This NOW)**

Before starting ANY challenge room:
1. Open your phone timer app
2. Create a repeating 30-minute timer labeled "STUCK CHECK"
3. Start it when you begin the room

**Every time the timer goes off:** Check if you're stuck. If yes, follow this protocol.

---

## 📋 STUCK PROTOCOL SEQUENCE

### **Phase 1: Minutes 0-10 (Document & Enumerate)**

**Action: Fill out the Stuck Log (template below)**

Don't think. Just execute these commands and document output:

```bash
# 1. What ports are open?
nmap -sV -sC -p- <target-ip>

# 2. What web directories exist?
gobuster dir -u http://<target-ip> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt

# 3. What services are running with what versions?
# (Check nmap output again carefully)

# 4. Are there any obvious misconfigurations?
# (Check your enumeration checklist below)
```

**Document in your Stuck Log:**
- What you've found (copy-paste command output)
- What you've tried and the results
- What you haven't checked yet

**Set timer for 10 minutes. Do NOT proceed until timer goes off.**

---

### **Phase 2: Minutes 10-20 (Check Your Notes)**

**Action: Search your own notes BEFORE anything else**

Open these files in Obsidian and search:

1. **`THM-Pen-Testing-Notes.md`** - Search for relevant keywords:
   - Service name (e.g., "SSH", "FTP", "HTTP")
   - Vulnerability type (e.g., "SQL injection", "command injection")
   - Privilege escalation (e.g., "SUID", "sudo", "cron")

2. **Your previous challenge writeups** - Have you seen this pattern before?
   - Search for similar services
   - Look for similar enumeration results

3. **`PRIVESC-CHECKLIST.md`** (if privesc is your blocker)

**Set timer for 10 minutes. Force yourself to read your notes.**

---

### **Phase 3: Minutes 20-30 (Try 3 Different Approaches)**

**Action: Execute 3 different attempts based on your enumeration**

Pick 3 different attack vectors and try them:

1. **Attempt 1:** [Based on enumeration finding 1]
2. **Attempt 2:** [Based on enumeration finding 2]  
3. **Attempt 3:** [Based on pattern from notes]

**Document each attempt in your Stuck Log with:**
- What you tried
- What command you ran
- What happened
- Why it didn't work

**Set timer for 10 minutes.**

---

### **Phase 4: Minute 30+ (Ask for Help)**

**If still stuck after 30 minutes:**

1. **Copy your Stuck Log** (see template below)
2. **Ask me for a directional hint** - Provide your filled-out Stuck Log
3. **I will give you Level 1-2 hint** (directional only, no solutions)
4. **Return to Phase 1** with new direction

**IMPORTANT:** At this point, you are **NOT ALLOWED** to Google "[roomname] walkthrough"

If you're tempted, you must:
1. Close the browser tab
2. Take a 5-minute break
3. Come back and ask me instead

---

## 📝 STUCK LOG TEMPLATE

Copy this template into a new note every time you get stuck:

```markdown
# STUCK LOG - [Room Name]

**Date:** [YYYY-MM-DD]  
**Time Stuck:** [HH:MM]  
**Phase:** [Enumeration / Initial Access / Privilege Escalation]

---

## Current Status

**Where I am:**
- [ ] Have not gained initial access
- [ ] Have initial access as user: [username]
- [ ] Attempting privilege escalation
- [ ] Completely lost

**Current user (if shell obtained):** 
**Current directory (if shell obtained):**

---

## Enumeration Results

### Ports/Services Found
```
[Paste nmap output here]
```

### Web Directories Found (if applicable)
```
[Paste gobuster/dirbuster output here]
```

### Interesting Findings
- Finding 1:
- Finding 2:
- Finding 3:

---

## What I've Tried

### Attempt 1
**What I tried:**  
**Command used:**  
```bash
[command]
```
**Result:**  
**Why it didn't work:**

### Attempt 2
**What I tried:**  
**Command used:**  
```bash
[command]
```
**Result:**  
**Why it didn't work:**

### Attempt 3
**What I tried:**  
**Command used:**  
```bash
[command]
```
**Result:**  
**Why it didn't work:**

---

## What I Haven't Checked Yet

- [ ] Checked all ports (including high ports)
- [ ] Enumerated web directories thoroughly
- [ ] Checked for default credentials
- [ ] Looked for service version exploits
- [ ] Ran privilege escalation enumeration (if applicable)
- [ ] Checked for writable files/directories
- [ ] Looked at running processes
- [ ] Checked cron jobs
- [ ] Checked sudo permissions
- [ ] Searched for SUID binaries

---

## Where I Think The Block Is

**My hypothesis:** [What do you think the issue is?]

**Pattern this FEELS like:** [SUID? Sudo? Cron? Web vuln? Authentication?]

**What I'm missing:** [What knowledge/skill do you think you need?]

---

## Questions for Help

1. Am I in the right phase? (Should I still be enumerating?)
2. [Your specific question]
3. [Your specific question]

---

## Notes to Self

[Any observations, thoughts, or reminders]
```

---

## 🛡️ ANTI-WALKTHROUGH BARRIERS

### **Browser-Level Blocking (HIGHLY RECOMMENDED)**

**Option 1: LeechBlock NG (Firefox/Chrome)**
1. Install LeechBlock NG extension
2. Add these to block list:
   ```
   *writeup*
   *walkthrough*
   medium.com/*thm*
   medium.com/*tryhackme*
   github.com/*writeup*
   github.com/*walkthrough*
   ```
3. Set block time: Monday-Sunday, 7:00 AM - 11:59 PM
4. Enable "Prevent access to extension settings"

**Option 2: /etc/hosts (Nuclear Option - Linux/Mac)**
```bash
# Add these lines to /etc/hosts (requires sudo)
127.0.0.1 medium.com
127.0.0.1 github.com
```
(Comment them out when NOT doing THM with `#` at start of line)

**Option 3: Cold Turkey (Windows)**
- Download Cold Turkey Blocker
- Block walkthrough domains during study hours

---

## 🎯 THE CHEAT SHEET (Keep This Visible)

> **Copy this to a separate note called `PRIVESC-CHECKLIST.md` and pin it**

### **When Stuck on Initial Access**

Run this enumeration sequence:

```bash
# Full port scan
nmap -p- -sV -sC <target-ip>

# Web enumeration (if port 80/443 open)
gobuster dir -u http://<target-ip> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt

# Check for default credentials on login pages
# Common: admin/admin, admin/password, root/root, admin/admin123

# Check service versions for known exploits
searchsploit <service-name> <version>
```

### **When Stuck on Privilege Escalation (Linux)**

Run these commands in order. Document what you find.

```bash
# 1. Who am I?
whoami
id

# 2. What can I run as sudo?
sudo -l

# 3. SUID binaries
find / -perm -4000 2>/dev/null

# 4. Cron jobs
cat /etc/crontab
ls -la /etc/cron.*

# 5. Writable files/directories in sensitive locations
find / -writable -type d 2>/dev/null
find / -writable -type f 2>/dev/null | grep -v proc

# 6. PATH variable
echo $PATH

# 7. Running processes as root
ps aux | grep root

# 8. Kernel version (for kernel exploits - LAST RESORT)
uname -a

# 9. Environment variables
env

# 10. Check for interesting files
ls -la /home
ls -la ~
cat ~/.bash_history
```

**Pattern matching:**
- **Found SUID binary?** → Check GTFOBins: https://gtfobins.github.io/
- **Found sudo permission?** → Check what the binary can do
- **Found cron job as root?** → Read the script, look for wildcards or writable paths
- **Found writable file in PATH?** → PATH hijacking opportunity

---

## 🔄 ACCOUNTABILITY SYSTEM

### **After Each Room Session**

Create a note: `Session-Log-[Room-Name]-[Date].md`

```markdown
# Session Log - [Room Name]

**Date:** [YYYY-MM-DD]  
**Time Spent:** [X hours]  
**Session Type:** [Enumeration / Exploitation / Privesc]

---

## Temptation Tracker

**Times I wanted to look up a walkthrough:** [Number]  
**Times I actually looked up a walkthrough:** [Number]  
**Times I used my stuck protocol instead:** [Number]  

---

## What Worked

- Used stuck protocol: [Yes/No]
- Asked for directional hint: [Yes/No]
- Found answer in my own notes: [Yes/No]
- Average time before asking for help: [X minutes]

---

## What Didn't Work

- Rushed enumeration: [Yes/No]
- Skipped stuck protocol: [Yes/No]
- Gave up too early: [Yes/No]
- Looked up walkthrough: [Yes/No]

---

## Next Session Goals

1. [Specific behavior to improve]
2. [Specific behavior to improve]

---

## Pattern Recognition

**This room reinforced:** [Pattern/technique]  
**Similar to:** [[Previous room with same pattern]]  
**New pattern learned:** [If any]
```

---

## 🧠 PSYCHOLOGY HACKS (For the "Lazy" Brain)

### **Make the Right Choice Easier**

**1. Friction Addition (Make walkthroughs ANNOYING)**
- Block walkthrough sites (see Anti-Walkthrough Barriers)
- Put your phone in another room (so you can't Google on mobile)
- Use a separate browser for THM that has walkthrough sites blocked

**2. Friction Reduction (Make stuck protocol EASY)**
- Pin `WHEN-STUCK-PROTOCOL.md` to Obsidian sidebar
- Create keyboard shortcut to open Stuck Log template
- Keep terminal window with cheat sheet commands ready to copy-paste

**3. Accountability**
- At the end of each session, update your Session Log
- Track your "walkthrough temptation" stats
- Celebrate when you resist looking things up

**4. Reward System**
- Every time you solve something WITHOUT walkthroughs → Write it in your Session Log as a WIN
- Every time you solve something after using stuck protocol → Document the EXACT process that worked

---

## 🎯 QUICK START CHECKLIST

Before starting ANY challenge room:

- [ ] Pin `WHEN-STUCK-PROTOCOL.md` in Obsidian sidebar
- [ ] Open `PRIVESC-CHECKLIST.md` in a split pane
- [ ] Set 30-minute timer on phone
- [ ] Create `[Room-Name]-Live-Notes.md` file
- [ ] Have `Stuck-Log-Template` ready to copy
- [ ] Block walkthrough sites (if not already blocked)
- [ ] Put phone in another room
- [ ] Tell yourself: "I have 30 minutes before I can ask for help"

---

## 💪 MINDSET REMINDERS

**When tempted to look up a walkthrough:**

1. **"I haven't exhausted my enumeration yet"**  
   → Run the checklist again, slower this time

2. **"I have my own notes for this"**  
   → Search your notes for 5 minutes before anything else

3. **"30 minutes is not a long time"**  
   → Set the timer and commit to trying

4. **"I will not learn if I skip this struggle"**  
   → The struggle IS the learning

5. **"I can ask for a directional hint"**  
   → Asking for help ≠ looking up the answer

---

## 🚀 BOTTOM LINE

**Your brain will default to the easiest path.**

Make walkthroughs harder to access than your stuck protocol.

Make your stuck protocol easier to use than looking things up.

Make asking me for help easier than Googling.

**The goal is not to never get stuck. The goal is to build the habit of working through being stuck.**

Start Lookup. Follow this protocol. Report back.
