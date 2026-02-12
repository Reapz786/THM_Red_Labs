---
title: Startup
difficulty: Easy
platform: THM
tags:
tools:
date: 2026-02-11
---
![](Obsidian%20assets/Startup.png)

> [!info]
> Abuse traditional vulnerabilities via untraditional means.
> 
> **We are Spice Hut,** a new startup company that just made it big! We offer a variety of spices and club sandwiches (in case you get hungry), but that is not why you are here. To be truthful, we aren't sure if our developers know what they are doing and our security concerns are rising. We ask that you perform a thorough penetration test and try to own root. Good luck!

> [!important]
> Target IP: 10.64.145.68
> 
> What is the secret spicy soup recipe?

> [!info]
> Ok will run the usual scans of nmap/gobuster but will look to try Nikto which is a recent tool I learnt about so lets go!

> [!note]
> Lets show the nmap scan first - i did a scan across all ports and then did a aggresive scan after seeing only 3 open ports - ftp, ssh & http.

```
root@ip-10-64-88-17:~# sudo nmap 10.64.145.68 -p-
sudo: unable to resolve host ip-10-64-88-17: Name or service not known
Starting Nmap 7.80 ( https://nmap.org ) at 2026-02-11 18:25 GMT
mass_dns: warning: Unable to open /etc/resolv.conf. Try using --system-dns or specify valid servers with --dns-servers
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 10.64.145.68
Host is up (0.00044s latency).
Not shown: 65532 closed ports
PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 3.70 seconds
root@ip-10-64-88-17:~# sudo nmap 10.64.145.68 -A
sudo: unable to resolve host ip-10-64-88-17: Name or service not known
Starting Nmap 7.80 ( https://nmap.org ) at 2026-02-11 18:26 GMT
mass_dns: warning: Unable to open /etc/resolv.conf. Try using --system-dns or specify valid servers with --dns-servers
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 10.64.145.68
Host is up (0.00057s latency).
Not shown: 997 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| drwxrwxrwx    2 65534    65534        4096 Nov 12  2020 ftp [NSE: writeable]
| -rw-r--r--    1 0        0          251631 Nov 12  2020 important.jpg
|_-rw-r--r--    1 0        0             208 Nov 12  2020 notice.txt
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.64.88.17
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 3
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 b9:a6:0b:84:1d:22:01:a4:01:30:48:43:61:2b:ab:94 (RSA)
|   256 ec:13:25:8c:18:20:36:e6:ce:91:0e:16:26:eb:a2:be (ECDSA)
|_  256 a2:ff:2a:72:81:aa:a2:9f:55:a4:dc:92:23:e6:b4:3f (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Maintenance
Device type: general purpose
Running: Linux 3.X
OS CPE: cpe:/o:linux:linux_kernel:3
OS details: Linux 3.10 - 3.13
Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 80/tcp)
HOP RTT     ADDRESS
1   0.56 ms 10.64.145.68

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.69 seconds
```

> [!note]
> Ran gobuster and found a /files to access which seems suspect AF so ill explore this after I am happy with the level of enumeration i've done

```
root@ip-10-64-88-17:~# gobuster dir -u http://10.64.145.68:80/ -w /usr/share/wordlists/dirb/common.txt
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://10.64.145.68:80/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.htpasswd            (Status: 403) [Size: 277]
/.hta                 (Status: 403) [Size: 277]
/.htaccess            (Status: 403) [Size: 277]
/files                (Status: 301) [Size: 312] [--> http://10.64.145.68/files/]
/index.html           (Status: 200) [Size: 808]
/server-status        (Status: 403) [Size: 277]
Progress: 4614 / 4615 (99.98%)
===============================================================
Finished
===============================================================
```

> [!note]
> Inspecting the webpage page source didnt reveal much even the contact us didnt reveal much.
> 

![](Obsidian%20assets/Pagesource.png)

> [!note]
> so using Nikto revealed 4 OSVDB's which include a Apache default file and a /files directory

```
root@ip-10-64-88-17:~# nikto -h 10.64.145.68
- Nikto v2.1.5
---------------------------------------------------------------------------
+ Target IP:          10.64.145.68
+ Target Hostname:    10.64.145.68
+ Target Port:        80
+ Start Time:         2026-02-11 18:34:52 (GMT0)
---------------------------------------------------------------------------
+ Server: Apache/2.4.18 (Ubuntu)
+ Server leaks inodes via ETags, header found with file /, fields: 0x328 0x5b3e1b06be884 
+ The anti-clickjacking X-Frame-Options header is not present.
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Allowed HTTP Methods: GET, HEAD, POST, OPTIONS 
+ OSVDB-3268: /files/: Directory indexing found.
+ OSVDB-3092: /files/: This might be interesting...
+ OSVDB-3233: /icons/README: Apache default file found.
+ 6544 items checked: 0 error(s) and 6 item(s) reported on remote host
+ End Time:           2026-02-11 18:35:02 (GMT0) (10 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

> [!info]
> With the initial enumeration done, I can proceed enumeration with /files as a potential attack vector so lets see where that leads us.

![](Obsidian%20assets/AmongUs.png)

> [!note]
> Funny images aside, I'm betting the image has something to show me via steganography...
> Lets run some CMDs to reveal the hidden fies/text with zsteg as its a .png file

```
root@ip-10-64-88-17:~/Downloads# zsteg important.png 
imagedata           .. file: SVR2 pure executable (USS/370)
chunk:0:IHDR        .. file: dBase III DBT, version number 0, next free block index 3741450240
b4,rgb,lsb,xy       .. text: "Uwwwwwwwwwwww"
```

> [!info]
> OK, not sure what files this relates to but was advised online to use -a for an aggressive scan.

> [!note]
> Ran the aggresive scan but a whole of content came out so had to redirect into a readable file

```
zsteg -a important.png > zsteg_output.txt
```

> [!note]
> Random text here and there so I'll just add what I think is key info for now.

```
b5p,abgr,msb,xy     .. file: old packed data
b6,r,lsb,xy         .. text: "YvYavZEw"
b6p,r,lsb,xy        .. text: "````````yab`"
b6p,rgb,lsb,xy      .. text: "````````````````ze`e`Z`p"
b6p,abgr,msb,xy     .. text: ["?" repeated 16 times]
b7p,r,msb,xy        .. text: ["\r" repeated 8 times]
b7p,rgb,msb,xy      .. text: "\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r="
b7p,abgr,msb,xy     .. file: RDI Acoustic Doppler Current Profiler (ADCP)
b1,r,lsb,XY         .. file: raw G3 (Group 3) FAX, byte-padded
b2,r,lsb,XY         .. file: SoftQuad DESC or font file binary
b2,r,msb,XY         .. file: VISX image file
b2,g,lsb,XY         .. file: SoftQuad DESC or font file binary
b2,g,msb,XY         .. file: VISX image file
b2,b,lsb,XY         .. file: AIX core file fulldump
b2,abgr,lsb,XY      .. file: MIT scheme (library?)
b3,rgba,lsb,XY      .. text: "'2s73s72s"
b4,b,lsb,XY,prime   .. text: "lC33P54z"

```

> [!info]
> Looking online and its apparently just false positives but key info like file types is like zip or whatever similar to enum further.

```
root@ip-10-64-88-17:~/Downloads# binwalk -e important.png

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             PNG image, 735 x 458, 8-bit/color RGBA, non-interlaced
57            0x39            Zlib compressed data, compressed
```

> [!note]
> Using knowledge from Agent Sudo CTF, I was able to determine binwalk the correct tool to use and find hidden files like a PNG and a Zlib - so it was a PNG within a PNG! INCEPTION!

![](Obsidian%20assets/INCEPTION.png)

```
root@ip-10-64-88-17:~/Downloads# ls -la
total 368
drwxr-xr-x  3 root root   4096 Feb 11 19:19 .
drwxr-xr-x 51 root root   4096 Feb 11 18:31 ..
-rw-r--r--  1 root root 251631 Feb 11 18:38 important.png
drwxr-xr-x  2 root root   4096 Feb 11 19:19 _important.png.extracted
-rw-r--r--  1 root root   1801 Nov 19  2024 owasp_zap_root_ca.cer
-rw-r--r--  1 root root 102777 Feb 11 19:07 zsteg_output.txt
root@ip-10-64-88-17:~/Downloads# ls _important.png.extracted/
39  39.zlib
```

> [!note]
> got a zlib file it seems but can still be a false positive so best to extract and see whats going on with it.

```
root@ip-10-64-88-17:~/Downloads# file _important.png.extracted/39
_important.png.extracted/39: empty
```

> [!note]
> Yep was a dud....Need to see where else I can pivot...find out in the next episode of DBZ!

![](Obsidian%20assets/DBZ%20next%20time.png)

> [!info]
> Anyways I decided to cheat by looking at a hint which said:
> 
> FTP and HTTP. What could possibly go wrong?
> 
>The way they phrased that hint was to suggest they are linked but obviously I know they are insecure ports.

```
root@ip-10-64-88-17:~/Downloads# nmap -A -O -sV -sC 10.64.145.68
Starting Nmap 7.80 ( https://nmap.org ) at 2026-02-11 19:47 GMT
mass_dns: warning: Unable to open /etc/resolv.conf. Try using --system-dns or specify valid servers with --dns-servers
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 10.64.145.68
Host is up (0.00060s latency).
Not shown: 997 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| drwxrwxrwx    2 65534    65534        4096 Nov 12  2020 ftp [NSE: writeable]
| -rw-r--r--    1 0        0          251631 Nov 12  2020 important.jpg
|_-rw-r--r--    1 0        0             208 Nov 12  2020 notice.txt
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.64.88.17
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 4
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 b9:a6:0b:84:1d:22:01:a4:01:30:48:43:61:2b:ab:94 (RSA)
|   256 ec:13:25:8c:18:20:36:e6:ce:91:0e:16:26:eb:a2:be (ECDSA)
|_  256 a2:ff:2a:72:81:aa:a2:9f:55:a4:dc:92:23:e6:b4:3f (ED25519)
80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))
|_http-server-header: Apache/2.4.18 (Ubuntu)
|_http-title: Maintenance
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.80%E=4%D=2/11%OT=21%CT=1%CU=32387%PV=Y%DS=1%DC=T%G=Y%TM=698CDCD
OS:0%P=x86_64-pc-linux-gnu)SEQ(SP=108%GCD=1%ISR=108%TI=Z%CI=I%II=I%TS=8)OPS
OS:(O1=M2301ST11NW7%O2=M2301ST11NW7%O3=M2301NNT11NW7%O4=M2301ST11NW7%O5=M23
OS:01ST11NW7%O6=M2301ST11)WIN(W1=68DF%W2=68DF%W3=68DF%W4=68DF%W5=68DF%W6=68
OS:DF)ECN(R=Y%DF=Y%T=40%W=6903%O=M2301NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A
OS:=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%
OS:Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=
OS:A%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=
OS:Y%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%
OS:T=40%CD=S)

Network Distance: 1 hop
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 256/tcp)
HOP RTT     ADDRESS
1   0.54 ms 10.64.145.68

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 19.42 seconds
```

> [!note]
> Went back to basic enumeration with even more aggression from nmap to reveal the ftp server allows for anonymous login to explore another attack vector.

> [!info]
> If I can login as anonymous on ftp server then what can I find? Lets see..

```
root@ip-10-64-88-17:~/Downloads# ftp 10.64.145.68
Connected to 10.64.145.68.
220 (vsFTPd 3.0.3)
Name (10.64.145.68:root): anonymous 
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
200 PORT command successful. Consider using PASV.
150 Here comes the directory listing.
drwxrwxrwx    2 65534    65534        4096 Nov 12  2020 ftp
-rw-r--r--    1 0        0          251631 Nov 12  2020 important.jpg
-rw-r--r--    1 0        0             208 Nov 12  2020 notice.txt
226 Directory send OK.
```

> [!note]
> OK, officially confused...I already have these files. Maybe I didn't enumerate the files before properly?

> [!info]
> Back to it! Decided to look at the image after realising it was a jpg file! which according to steghide cmd is not a supported format so found out its a data type file.

```
root@ip-10-67-86-193:~# steghide extract -sf important.jpg 
Enter passphrase: 
steghide: the file format of the file "important.jpg" is not supported.
root@ip-10-67-86-193:~# file important.jpg 
important.jpg: data
root@ip-10-67-86-193:~# exiftool important.jpg
ExifTool Version Number         : 11.88
File Name                       : important.jpg
Directory                       : .
File Size                       : 246 kB
File Modification Date/Time     : 2026:02:12 18:01:46+00:00
File Access Date/Time           : 2026:02:12 18:02:57+00:00
File Inode Change Date/Time     : 2026:02:12 18:01:46+00:00
File Permissions                : rw-r--r--
Error                           : File format error
```

> [!note]
> Decided to read note.txt and saw two key info - people downloading files from website and a username called Maya. Lets try hydra?

```
root@ip-10-67-86-193:~# cat notice.txt 
Whoever is leaving these damn Among Us memes in this share, it IS NOT FUNNY. People downloading documents from our website will think we are a joke! Now I dont know who it is, but Maya is looking pretty sus.
```
 > [!note]
>Tried to upload a test file to check if anonymous login allows me to upload files for RCE but denied!

```
ftp> lcd root
Local directory now /root
ftp> put test.txt
local: test.txt remote: test.txt
200 PORT command successful. Consider using PASV.
553 Could not create file.
```