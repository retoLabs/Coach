#!/bin/bash
#[NOM:login.cgi][INFO:Concatena user.password, y redirecciona según esté o no el MD5]

echo "Content-type: text/html;charset=utf-8"
echo ""
echo ""

usr=$(echo $QUERY_STRING |cut -d'&' -f1 | cut -d'=' -f2)
pwd=$(echo $QUERY_STRING |cut -d'&' -f2 | cut -d'=' -f2)
tira=$(echo $usr.$pwd | md5sum)
n=$(cat retoClaus.txt | grep $tira | wc -l)

if [ "$n" = 1 ]
then
	echo "<html>"
	echo "<head>"
	echo "</head>"
	echo "<body>"
	echo "<script>window.location='/proyRETO.html';</script>"
	echo "</body>"
	echo "</html>"
else
	echo "<html>"
	echo "<head>"
	echo "</head>"
	echo "<body>"
	echo "<script>window.location='/index.html';</script>"
	echo "</body>"
	echo "</html>"
fi

exit 0