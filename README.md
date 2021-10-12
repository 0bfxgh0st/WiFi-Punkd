# WiFi-Punkd

WiFi-Punkd is a easy way to deploy a 'fake' access point  
Additionally a fake facebook login page template only for test purposes  
(Future features websites login portal plugin template to load)  

# Install required programs
apt-get install xterm hostapd dnsmasq apache2 macchanger -y  

# Screenshots
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot001.png)    
<pre>
Running wifi-punkd.sh
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot002.png)  
Android client connecting through our fake ap and giving ip address with dnsmasq as dhcp server  
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot4.png)  
<pre>
What client sees in this case is an android  
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot5.png)  
<pre>
Connected with credentials in this POC  
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot6.png)  
<pre>
Client request facebook.es dns   
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot7.png)  
<pre>
And we give them a fake one with help from dnsmasq and apache2 server  
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot8.png)  
<pre>
Client login with his credentials, will see a 'Done' message in the webpage (because this is a POC)  
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot9.png)  
<pre>
We can check credentials via browser  
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot10.png)  
<pre>
Or we can check credentials via terminal  
</pre>
![alt text](https://github.com/0bfxGH0ST/WiFi-Punkd/blob/main/screenshots/screenshot11.png)  


# IMPORTANT NOTES
* The network interface it must not be connected to the Internet  
* If you want WAN connection too you will need make some changes in the rogueap.sh source code by editing routes  
* Is your /etc/NetworkManager/system-connections/ folder running any network profile? Delete it to avoid troubleshoting  
* Macchanger auto-change will be disabled by rogueap.sh to prevent fake ap fails  
keep in mind that you will need change mac address manually to avoid real mac leaks  
to reenable macchanger auto-change when you finish with wifi-punkd.sh go to /etc/NetworkManager/NetworkManager.conf and delete the following line

<pre>
[device]  
wifi.scan-rand-mac-address=no  
</pre>
