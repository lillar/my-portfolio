---
title: Traveling alone?
keywords:
	- data visualization
	- tableau
	- travel
	- solo travel
	- Hungary
    - Google Trends
tags: 
    - data visualization
    - tableau
    - travel
    - data for fun
category: Data Visualization
date: 2020-11-29
time: 09:00:00
clearReading: true
thumbnailImage: solo_astronaut.png
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

**_The Hungarian way of traveling solo_**

 <!-- more -->

For 4 years now with my friends we submit an application to the Budapest BI Forum’s dataviz challenge. This year data was provided by szallas.hu an online agency for lodging reservations in Hungary and nearby countries in Central Europe.

As usually, topics were not restricted, so we were free to come up with any ideas how data could be visualized. Data depicted domestic reservations from 2020 aggregated on a monthly level.

We had a brainstorming session with Sara and Eszter, but couldn’t find the story which would kick the door. So I kept exploring the data trying to discover any other insight than the obvious trends. And while researching hospitality metrics and ways to enrich data, I stumbled into an article about solo traveling.

### Who are solo travelers?

Solo travelers are casual people like most of us, except with the extraordinary courage to take the whole world alone. This decision could fit their lifestyle, wanderlust or even the case of being single but still wanting to see new places. The sense of freedom and self discovery are common reasons why one might choose traveling alone.

### What’s the trend of solo traveling?

What I’ve learned from the reports, that people are eager to engage with the experience of complete independence (hm, am I... or you?). Considering the data available in my sample dataset, I focused on 3 indicators: what’s the ratio of solo travelers, what’s the average length of their trips and how advanced do they manage bookings.

According to the Klook online travel agency’s [research](https://www.klook.com/newsroom/content/6388?n=0) in 2019:

> „76% of respondents globally have either traveled solo or are considering it, regardless of age, gender, and nationalities.”

Which didn’t exactly gave the ratio compared to couples or groups, still shows an emerging segment. Google Trends also supports their findings, as worldwide searching „solo travel” peaked at the end of 2019.

<img src="solo-travel-trend.png" alt="Google Trend of solo travel search term worldwide between 2015 January and 2020 November">

After all, I found my numbers in another [research](https://www.travelport.com/insights/how-online-travel-agencies-can-target-solo-travelers) conducted in 2019 by Travelport, stating that:

- **18%** of global bookings in the last year by those travelling alone
- The average lead time is **49 days**
- The average trip length is **19 days**
- **31%** are domestic trips

What I wanted to figure out now, whether international trends are observable in Hungary. Check out my report below.

<div class='tableauPlaceholder' id='viz1606595120814' style='position: relative'><noscript><a href='#'><img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Bo&#47;Book1_16050813894300&#47;SoloutazasMagyarorszagon&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='Book1_16050813894300&#47;SoloutazasMagyarorszagon' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Bo&#47;Book1_16050813894300&#47;SoloutazasMagyarorszagon&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1606595120814');                    var vizElement = divElement.getElementsByTagName('object')[0];                    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='805px';vizElement.style.height='852px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='805px';vizElement.style.height='852px';} else { vizElement.style.width='100%';vizElement.style.height='927px';}                     var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>
