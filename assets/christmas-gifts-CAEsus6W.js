var e=`---
title: "Christmas comes but once a year" 
keywords:
	- data visualization
	- data analysis
	- christmas
	- decision tree
tags: 
	- data visualization
	- christmas
	- data for fun
category: Data Visualization
date: 2020-12-23
time: 11:00:00
clearReading: true
thumbnailImage: christmas.png
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

**_But what should I give to the family (again)?_**

 <!-- more -->

Writing a [post](/my-portfolio/blog/solo-traveling) about our application to the Budapest BI Forum’s contest made me feel nostalgic, and I found my favorite dataviz from 2017. Just like in 2020, I was working with my best brainstorming buddies, [Sara T. Kocsis](https://www.linkedin.com/in/sara-t-kocsis/) and [Eszter Somos](https://www.linkedin.com/in/esztersomos/).

That year the Hungarian bank OTP provided data on their discount program, including demographics, activated offers and transactions. Maybe because of the stores were being full with Christmas vibes, or my memories just faded with time, but we instantly came up with the idea to do something specific to the holidays. And what gives the biggest headache every year if not to figure what to give to our loved ones – more than another pair of socks or bath bombs... or candles?

So, our submission had a sole business value to OTP: how to use the data for segmentation and how to personalize communication for the benefit of both the customers and them - by recommending special gift ideas! <i class="fas fa-candy-cane"></i> We chose to visualize the information as a decision tree using the demographic attributes and shopping behavior of customers. Each branch of the tree represents a dichotome question and evaluates whether the customer belongs to the specific group or not. Dividing factors are:

- Gender (male or female)
- Generation (Baby Boomer – BB, X, Y and Z presented as dichotome question like being in gen Z or not)
- Marital status (married or not)
- Current city of residence (1. living in the capital of Hungary, Budapest or not 2. living in a city with >100k inhabitants or not)
- Activated categories (food and drink, clothing, leisure, electronics, health, home, grocery)
- Spend above or below the average in the category

Using a decision tree like that, could support to deliver personalized call to action messages to customers via mobile app, email sub or socal media ads. Though I’m not a fan of ads, but if I need to watch them anyways, I appreciate when companies take the effort and try to show me something which actually could be relevant or gives me a good gift idea.

![OTP discount card - Christmas decision tree](decision-tree.png "OTP discount card - Christmas decision tree")
`;export{e as default};