> [!summary]
> A new start-up has a few issues with their web server.
> Root the box! Designed and created by [DarkStar7471](https://tryhackme.com/p/DarkStar7471), built by [Paradox](https://tryhackme.com/p/Paradox).

> [!important]
> Target ip: 10.66.139.221

> [!info]
> Ok Root box is end goal. I need to enumerate. I'll use gobuster/nmap/browse the site for vulns.

> [!note]
> I ran the following scans and got the following results from nmap/gobuster/site respectively:

```
┌──(kali㉿kali)-[~]
└─$ sudo nmap -A -p- 10.66.139.221 
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2026-02-08 04:42 EST
Nmap scan report for 10.66.139.221
Host is up (0.084s latency).
Not shown: 65534 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
| http-robots.txt: 1 disallowed entry 
|_/fuel/
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Welcome to FUEL CMS
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.95%E=4%D=2/8%OT=80%CT=1%CU=33032%PV=Y%DS=3%DC=T%G=Y%TM=69885B27
OS:%P=x86_64-pc-linux-gnu)SEQ(SP=101%GCD=1%ISR=109%TI=Z%CI=I%TS=A)SEQ(SP=10
OS:2%GCD=1%ISR=10C%TI=Z%CI=I%TS=A)SEQ(SP=104%GCD=1%ISR=108%TI=Z%CI=I%TS=A)S
OS:EQ(SP=104%GCD=1%ISR=10E%TI=Z%CI=I%TS=A)SEQ(SP=106%GCD=1%ISR=10C%TI=Z%CI=
OS:I%TS=A)OPS(O1=M4E8ST11NW7%O2=M4E8ST11NW7%O3=M4E8NNT11NW7%O4=M4E8ST11NW7%
OS:O5=M4E8ST11NW7%O6=M4E8ST11)WIN(W1=68DF%W2=68DF%W3=68DF%W4=68DF%W5=68DF%W
OS:6=68DF)ECN(R=Y%DF=Y%T=40%W=6903%O=M4E8NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=
OS:O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD
OS:=0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0
OS:%S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1
OS:(R=Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI
OS:=N%T=40%CD=S)

Network Distance: 3 hops

TRACEROUTE (using port 111/tcp)
HOP RTT      ADDRESS
1   83.58 ms 192.168.128.1
2   ...
3   83.90 ms 10.66.139.221

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 132.11 seconds
```
```
┌──(kali㉿kali)-[~]
└─$ gobuster dir -u http://10.66.139.221/ -w /usr/share/dirb/wordlists/common.txt
===============================================================
Gobuster v3.8
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.66.139.221/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/dirb/wordlists/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.8
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 292]
/.htaccess            (Status: 403) [Size: 297]
/.htpasswd            (Status: 403) [Size: 297]
/@                    (Status: 400) [Size: 1134]
/0                    (Status: 200) [Size: 16597]
/assets               (Status: 301) [Size: 315] [--> http://10.66.139.221/assets/]                                                                    
/home                 (Status: 200) [Size: 16597]
/index                (Status: 200) [Size: 16597]
/index.php            (Status: 200) [Size: 16597]
/lost+found           (Status: 400) [Size: 1134]
/offline              (Status: 200) [Size: 70]
/robots.txt           (Status: 200) [Size: 30]
/server-status        (Status: 403) [Size: 301]
Progress: 4613 / 4613 (100.00%)
===============================================================
Finished
===============================================================
```

> [!info]
> before getting into the site section as its a lot of enumeration I did, nmap revealed only 1 port available which was port 80 and gobuster revealed a few filepaths to try so I included them below and will review them with more information.

![](assets/Fuel%20CMS%20v1.4%20main%20site.png)
![](assets/robots.txt.png)
![](assets/login%20with%20base64%20encoded.png)
![](assets/Pasted%20image%2020260208095840.png)
![](assets/admin%20login.png)
