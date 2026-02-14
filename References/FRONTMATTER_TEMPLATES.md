# 📝 FRONTMATTER TEMPLATES FOR ALL WRITE-UPS

## ✅ Ignite (ALREADY DONE)
```markdown
---
title: "Ignite"
difficulty: Easy
platform: THM
tags: [Web Exploitation, Linux, RCE, CVE Exploitation, Privilege Escalation]
tools: [Nmap, Gobuster, Python, Netcat]
date: 2026-02-08
---
```

## 📋 TEMPLATES FOR OTHER WRITE-UPS:

### Simple CTF
```markdown
---
title: "Simple CTF"
difficulty: Easy
platform: THM
tags: [Web Exploitation, Linux, SQL Injection, Privilege Escalation, CMS Exploitation]
tools: [Nmap, Gobuster, Python, Metasploit, SSH]
date: 2026-02-01
---
```

### Footprinting (Easy)
```markdown
---
title: "Footprinting"
difficulty: Easy
platform: HTB
tags: [Reconnaissance, OSINT, Information Gathering, Network Scanning]
tools: [Nmap, Whois, Dig, NSLookup, TheHarvester]
date: 2026-01-15
---
```

### Footprinting (Medium)
```markdown
---
title: "Footprinting"
difficulty: Medium
platform: HTB
tags: [Reconnaissance, OSINT, Information Gathering, Network Scanning, DNS Enumeration]
tools: [Nmap, Whois, Dig, NSLookup, TheHarvester, Shodan]
date: 2026-01-20
---
```

---

## 🔧 HOW TO ADD FRONTMATTER:

### **Step 1:** Open each `.md` file in Obsidian

### **Step 2:** If file starts with regular text:
```markdown
Deploy the machine and attempt the questions!
```

**Change to:**
```markdown
---
title: "Room Name"
difficulty: Easy
platform: THM
tags: [Web Exploitation, Linux]
tools: [Nmap, Gobuster]
date: 2026-02-01
---

Deploy the machine and attempt the questions!
```

### **Step 3:** Save and push to GitHub

---

## 📊 HOW TO DETERMINE VALUES:

### **title:**
- Use the room name from TryHackMe/HackTheBox
- Examples: "Ignite", "Simple CTF", "Footprinting"

### **difficulty:**
- Easy, Medium, or Hard
- Check the room's difficulty rating

### **platform:**
- THM (for TryHackMe)
- HTB (for HackTheBox)

### **tags:** (Techniques/Attack Vectors)
Common tags to use:
- Web Exploitation
- Linux
- Windows
- RCE (Remote Code Execution)
- SQL Injection
- Privilege Escalation
- CVE Exploitation
- Reconnaissance
- OSINT
- Information Gathering
- Network Scanning
- Brute Force
- Password Cracking
- Buffer Overflow
- Active Directory
- CMS Exploitation

### **tools:** (Specific Tools Used)
List EVERY tool you used in the write-up:
- Nmap
- Gobuster
- Burp Suite
- Metasploit
- SQLMap
- Netcat (nc)
- Hydra
- John the Ripper
- Hashcat
- Python
- SSH
- FTP
- Wireshark
- FFuf
- Enum4linux
- SMBClient
- Nikto
- WPScan
- LinPEAS
- WinPEAS
- Searchsploit
- Exploit-DB
- Dirb
- Dirbuster
- Curl
- Wget

### **date:**
- Format: YYYY-MM-DD
- Use the date you completed/published the room

---

## 🤖 AUTOMATION:

Once you add `tools:` to frontmatter:
1. Jekyll automatically counts unique tools
2. Displays "X Tools Practiced" on homepage
3. Shows which write-ups used each tool
4. Links directly to those write-ups

**Example:**
```
Tools Practiced: 12

Nmap x 4 → [Ignite] [Simple CTF] [Room3] [Room4]
Gobuster x 3 → [Ignite] [Simple CTF] [Room5]
Burp Suite x 2 → [Room2] [Room6]
```

---

## 📝 QUICK REFERENCE TEMPLATE:

Copy this for each new write-up:

```markdown
---
title: "ROOM_NAME_HERE"
difficulty: Easy|Medium|Hard
platform: THM|HTB
tags: [Tag1, Tag2, Tag3, Tag4]
tools: [Tool1, Tool2, Tool3, Tool4]
date: YYYY-MM-DD
---

> [!important]
> Target IP: X.X.X.X

(Your write-up content here...)
```

---

## ✅ AFTER ADDING FRONTMATTER:

1. Save all files
2. Push to GitHub:
```bash
git add .
git commit -m "Add frontmatter to all write-ups"
git push
```

3. Wait 2-3 minutes for rebuild
4. Check homepage - stats will update automatically

---

## 🎯 BENEFITS:

- ✅ **Tools stat works** - Shows actual count
- ✅ **Searchable** - Filter by tool, technique, difficulty
- ✅ **Organized** - Metadata at top of each file
- ✅ **Automatic** - Jekyll reads it, no manual site updates
- ✅ **Future-proof** - Easy to add more fields later

---

**Add frontmatter to Simple CTF and both Footprinting write-ups now, push, and Tools Practiced will show the correct count!**
