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