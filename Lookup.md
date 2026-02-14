---
title: Lookup
difficulty: Easy
platform: THM
tags:
tools:
date: 2026-02-14
---
![](Obsidian%20assets/Lookup.png)

> [!important]
> Test your enumeration skills on this boot-to-root machine.
> 
> **Lookup** offers a treasure trove of learning opportunities for aspiring hackers. This intriguing machine showcases various real-world vulnerabilities, ranging from web application weaknesses to privilege escalation techniques. By exploring and exploiting these vulnerabilities, hackers can sharpen their skills and gain invaluable experience in ethical hacking. Through "Lookup," hackers can master the art of reconnaissance, scanning, and enumeration to uncover hidden services and subdomains. They will learn how to exploit web application vulnerabilities, such as command injection, and understand the significance of secure coding practices. The machine also challenges hackers to automate tasks, demonstrating the power of scripting in penetration testing.﻿

> [!important]
> What is the user flag?

> [!important]
> Target IP: 10.66.172.224

> [!info]
> First things first, enumeration! Gobuster, Nikto, Nmap, web exploits.

```
┌──(kali㉿kali)-[~]
└─$ sudo nmap 10.66.172.224 -O -A -sV -sC
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2026-02-14 08:36 EST
Nmap scan report for 10.66.172.224
Host is up (0.085s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 74:63:07:ed:00:c0:8a:be:82:e2:6b:07:62:b9:b4:c8 (RSA)
|   256 a7:79:3c:8a:78:68:f4:8e:84:c1:89:ec:36:af:58:2c (ECDSA)
|_  256 a2:16:58:58:71:4e:7f:94:df:a8:8b:98:43:71:7c:98 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Did not follow redirect to http://lookup.thm
|_http-server-header: Apache/2.4.41 (Ubuntu)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.95%E=4%D=2/14%OT=22%CT=1%CU=38972%PV=Y%DS=3%DC=T%G=Y%TM=69907A6
OS:A%P=x86_64-pc-linux-gnu)SEQ(SP=104%GCD=1%ISR=105%TI=Z%CI=Z%TS=A)SEQ(SP=1
OS:05%GCD=1%ISR=107%TI=Z%CI=Z%TS=A)SEQ(SP=106%GCD=1%ISR=10B%TI=Z%CI=Z%TS=A)
OS:SEQ(SP=107%GCD=1%ISR=10B%TI=Z%CI=Z%TS=A)SEQ(SP=F5%GCD=1%ISR=110%TI=Z%CI=
OS:Z%TS=A)OPS(O1=M4E8ST11NW7%O2=M4E8ST11NW7%O3=M4E8NNT11NW7%O4=M4E8ST11NW7%
OS:O5=M4E8ST11NW7%O6=M4E8ST11)WIN(W1=F4B3%W2=F4B3%W3=F4B3%W4=F4B3%W5=F4B3%W
OS:6=F4B3)ECN(R=Y%DF=Y%T=40%W=F507%O=M4E8NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=
OS:O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD
OS:=0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0
OS:%S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1
OS:(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI
OS:=N%T=40%CD=S)

Network Distance: 3 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 256/tcp)
HOP RTT      ADDRESS
1   85.84 ms 192.168.128.1
2   ...
3   85.91 ms 10.66.172.224

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 30.21 seconds
```
```
┌──(kali㉿kali)-[~]
└─$ gobuster dir -u http://10.66.172.224/ -w /usr/share/dirb/wordlists/common.txt
===============================================================
Gobuster v3.8
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.66.172.224/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/dirb/wordlists/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.8
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.htpasswd            (Status: 403) [Size: 278]
/.htaccess            (Status: 403) [Size: 278]
/.hta                 (Status: 403) [Size: 278]
/index.php            (Status: 302) [Size: 0] [--> http://lookup.thm]
/server-status        (Status: 403) [Size: 278]
Progress: 4613 / 4613 (100.00%)
===============================================================
Finished
===============================================================
```

![](Obsidian%20assets/Login%20page.png)

![](Obsidian%20assets/Login%20Page%20-%20Source%20code.png)

> [!note]
> Ok so before posting Nikto results, let's review the above - first with nmap - 2 ports only open SSH & HTTP - gobuster is not revealing any hidden directories - the login page indicates there is an exploit there possibly? burp suite can help? not sure again what im looking for but its about web enumeration for now im assuming...Anyway Nikot results below didnt reveal much.

```
┌──(kali㉿kali)-[~]
└─$ nikto -h http://lookup.thm/
- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          10.66.172.224
+ Target Hostname:    lookup.thm
+ Target Port:        80
+ Start Time:         2026-02-14 09:03:21 (GMT-5)
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ /: The anti-clickjacking X-Frame-Options header is not present. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
+ /: The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type. See: https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/missing-content-type-header/
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Apache/2.4.41 appears to be outdated (current is at least Apache/2.4.54). Apache 2.2.34 is the EOL for the 2.x branch.
+ /: Web Server returns a valid response with junk HTTP methods which may cause false positives.
+ 534 requests: 0 error(s) and 4 item(s) reported on remote host
+ End Time:           2026-02-14 09:04:09 (GMT-5) (48 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

```

> [!info]
> I'm going to use dig cmd and nslookup for sub-domains as that was mentioned in the first paragraph section about Lookup.

```
┌──(kali㉿kali)-[~]
└─$ dig http://lookup.thm/    

; <<>> DiG 9.20.11-4+b1-Debian <<>> http://lookup.thm/
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 4575
;; flags: qr rd ra ad; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;http://lookup.thm/.            IN      A

;; AUTHORITY SECTION:
.                       3415    IN      SOA     a.root-servers.net. nstld.verisign-grs.com. 2026021400 1800 900 604800 86400

;; Query time: 3 msec
;; SERVER: 192.168.50.120#53(192.168.50.120) (UDP)
;; WHEN: Sat Feb 14 09:10:01 EST 2026
;; MSG SIZE  rcvd: 122

                                                                           
┌──(kali㉿kali)-[~]
└─$ dig http://lookup.thm/ ANY

; <<>> DiG 9.20.11-4+b1-Debian <<>> http://lookup.thm/ ANY
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOTIMP, id: 54953
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1452
;; QUESTION SECTION:
;http://lookup.thm/.            IN      ANY

;; Query time: 0 msec
;; SERVER: 192.168.50.120#53(192.168.50.120) (TCP)
;; WHEN: Sat Feb 14 09:10:10 EST 2026
;; MSG SIZE  rcvd: 47
```

```
┌──(kali㉿kali)-[~]
└─$ nslookup lookup.thm                  
Server:         192.168.50.120
Address:        192.168.50.120#53
** server can't find lookup.thm: NXDOMAIN
┌──(kali㉿kali)-[~]
└─$ nslookup http://lookup.thm/
Server:         192.168.50.120
Address:        192.168.50.120#53
** server can't find http://lookup.thm/: NXDOMAIN
┌──(kali㉿kali)-[~]
└─$ nslookup 10.66.172.224     
** server can't find 224.172.66.10.in-addr.arpa: NXDOMAIN
```

[!note]
> Nothing useful but instead of looking online, I saw my notes that gobuster has a way to scan domains & subdomains.

```
gobuster dns -do lookup.thm -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
```

> [!note]
> Upon realising, you cannot check the subdomains like this if DNS port 53 is closed which it is.
> I pivoted to looking into Vhosts

```
gobuster vhost -u http://lookup.thm -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-20000.txt --append-domain
```
```
gobuster vhost -u http://lookup.thm -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-110000.txt --append-domain
```
```
gobuster vhost -u http://lookup.thm -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt --append-domain
```

> [!note]
> Unfortunately nothing came out of it...

```

```


