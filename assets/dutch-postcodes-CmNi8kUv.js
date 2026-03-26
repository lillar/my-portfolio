var e=`---
title: "Tableau doesn't recognize Dutch postcodes!" 
keywords:
	- data transformation
	- data analysis
	- tableau
	- python
	- jupyter notebook
	- geocoding
	- postecode
	- netherlands
tags: 
	- python
	- tableau
	- geocoding
	- data transformation
category: Data Transformation
date: 2022-09-11
time: 10:00:00
clearReading: true
thumbnailImage: brewery-thumb.png
thumbnailImagePosition: left
autoThumbnailImage: yes
metaAlignment: center
coverImage:
coverCaption: ""
coverMeta: out
coverSize: full
# gallery:
#     - 
comments: false
meta: true
actions: true
---
***How to use geocoding API in Python***
<!-- more -->

The Tableau community is always inspiring and there isn't a week without an outstanding visualization.

This post was the most recent one which made me post again after more than 1 year!

<div align=center>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">After traveling Scotland in July and buying lots of whisky, I wanted to buy a Scotland distillery map for my wall. Then, I figured I&#39;d just make one in <a href="https://twitter.com/tableau?ref_src=twsrc%5Etfw">@tableau</a>. Then I decided to make one for Kentucky, Ireland, and Japan as well! <a href="https://t.co/C8gaLuBlQy">pic.twitter.com/C8gaLuBlQy</a></p>&mdash; Ken Flerlage (@flerlagekr) <a href="https://twitter.com/flerlagekr/status/1564253871131820032?ref_src=twsrc%5Etfw">August 29, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>
</div>

I loved how data and art came together, and I wanted to do something similar for the Netherlands. But what is more popular here than whisky? Beer of course! 🍻

The idea was to visualize active breweries. I found a website - [Nederlandse Biercultuur](https://www.nederlandsebiercultuur.nl/) - which has all the info I needed, listing the brewery, the date when it opened and the address. It even specifies whether a brewery is production brewery e.g. it has its own boilers and sells beer under its own brand name. However, the data cannot be downloaded and even though I reached out to them, I haven't received an answer. 😞 So with some manual work, I had to collect data on my own.

But this is not the point of this post! After collecting the data, I was ready to start vizzing in Tableau Public (of course design was already waiting in Figma). This is when the second obsticle came... Tableau's built-in geocoding (OpenStreetMap) doesn't recognize Dutch postcodes!

> While ZIP code is a 4-digit number, Dutch postcodes consist of four digits followed by two uppercase letters (example: 1025PD). The first two digits stand for the city and region, the second two digits and the two letters indicate the range of housenumbers usually on the same street. Which means, that postcode is better than using the street name which can be prone to misspelling.

My dataset has **464** breweries from what 62 were excluded due having the same 4 digits. So I looked for a solution to generate longitude and latitude for the postcodes via API. Here comes my solution, which I hope could come handy for others too.

Initial data structure:

|Brewery|Province|Year Open|Address
| ----------- | ----------- |----------- |----------- |
|Bierbrouwerij Maallust|Drenthe|2011|Hoofdweg 140, 9341 BL Veenhuizen|
|Bierbrouwerij Kasparus|Flevoland|1994|Karwijhof 15, 8308 AJ Nagele|
|Brouwerij 't IJ|Noord-Holland|1985|Funenkade 7, 1018 AL Amsterdam|

For the data transformation I used Jupyter Notebook. 🐍

# Packages
\`\`\`
import pandas as pd
import requests
\`\`\`
If you don't have any of the packages installed, run install before:
\`\`\`
!pip install requests
\`\`\`
# Data transformation
If you look at the example, you'll see that *Address* includes the street name and number separated by comma and space from postcode and city: 
**Funenkade 7, 1018 AL Amsterdam.**

For the API calls, we'll need two columns, *postcode* and *streetnumber*.

\`\`\`
df = pd.read_excel("folder/subfolder/NL_provinces.xlsx")

#split at comma, and take the second part
df["postcode"] = df["Address"].str.split(",").str[1:].str.join("")

#extract the digits followed by at least 1 letter
df["postcode"] = df["postcode"].str.extract('(\\d+ [A-Za-z].)')

#remove the space between digits and letters
df["postcode"] = df["postcode"].str.replace(" ", "")

#split at comma, and take the first part
df["streetnumber"] = df["Address"].str.split(",").str[0].str.join("")

#extract the digits
df["streetnumber"] = df["streetnumber"].str.extract('(\\d+)')
\`\`\`
# API request
With the API request, we'll want to retrieve the latitude and longitude of a specified postcode and street number. I've used the API of [postcode.nl](https://www.postcode.nl/services/adresdata/api). Unfortunately, this API is not free, and after ~500 requests it will throw an error that you reached the limit and your IP will be blocked.

There is another API for [post.nl](https://developer.postnl.nl/browse-apis/addresses/geo-adrescheck/documentation-rest-v2/). I've requested access, so I might update this post later on.

\`\`\`
#create lists for latitude and longitude
lat = []
lon = []

#iterate over the table rows
for index, row in df.iterrows():
    try:

	#send a request for each row based on postcode and streetnumber
        postcode = str(row["postcode"])
        streetnumber = str(row["streetnumber"])

        req = "http://api.postcodedata.nl/v1/postcode/?postcode="+postcode+"&streetnumber="+streetnumber+"&ref=domeinnaam.nl&type=json"

        response = requests.get(req)

	#append the response to the lists
        lat.append(response.json()["details"][0]["lat"])
        lon.append(response.json()["details"][0]["lon"])
        
    except:

	#it might happen that your postcode is incorrect 
	#in that case append None to keep equal length as the table
        lat.append(None)
        lon.append(None)
\`\`\`
# Save table
\`\`\`
#add lat and lon lists as columns to the df
df["lat"] = lat
df["lon"] = lon

#finally export the table
df.to_csv("folder/subfolder/output.csv")
\`\`\`
# Viz in Tableau Public

Find the interactive version [here](https://public.tableau.com/views/ActivebreweriesintheNetherlands2022/NLBreweries?pixelratio=10). **Proost!** 🍻😊

<p align="center">
<img src=breweries-viz.png alt="The Netherlands active breweries in 2022"/><br>
</p>`;export{e as default};