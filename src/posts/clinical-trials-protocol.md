---
title: "Part II: The guidebook of clinical trials" 
keywords:
	- clinical research
	- trials
	- data analysis
	- study protocol
	- trial design
tags: 
	- clinical trials
	- study protocol
	- study design
	- research methodology
category: Clinical Trials
date: 2020-11-16
time: 11:00:00
clearReading: true
thumbnailImage: study_protocol.jpg
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

**_What is the study protocol and how is a trial designed?_**

 <!-- more -->

In the [previous article](/my-portfolio/blog/what-is-clinical-trial) I described the phases of a research and emphasized the number of regulations which encompass them. Just like in academic research, repeatability ensures the validity and reliability of results, thus detailed description of a study is indispensable. Scientists define the hypotheses, analysis method and population samples in advance, and clinical research team does the same.

This document is called the study protocol. It is a written plan, which covers the fundamental details - starting from the study objective -, which should be sufficient to clearly instruct the research team how to run the study. If the protocol is well written, it should cover the following topics as gathered by the Global Health Training Centre<sup>1</sup>:

1. General Information
2. Background and rationale
3. Aims and objectives
4. An overview of the research question and the study design
5. Methodology, interventions and allocations
6. Outcome measures
7. The sample size
8. Study population
9. Ethical aspects
10. Participant and community engagement
11. Research governance
12. Study management
13. Data collection and management
14. Monitoring study safety, quality and data
15. Adverse event reporting
16. Analysis strategies and statistical considerations
17. Setting up a research team
18. Post-recruitment retention strategies
19. Economic evaluation
20. Clinical laboratories
21. Reporting, dissemination and notifications of results
22. References and appendices

In this article, I’m going to introduce an important section, which is essential to understand even if you were not involved in writing the protocol: **the research methodology**.

There are other topics, which could be remarkably interesting for an analyst, so in _Part III_, you could read more about data collection and management, in _Part IV_ about analysis strategies and statistical considerations. Finally, in _Part V_, monitoring study safety, quality and data will be discussed. Originally, I didn’t want to go in too much detail with other topics, but after many hours of writing these posts I figured a super funny image to show a statistical concept, which I must share with all of you. So, I decided to dedicate a _separate article_ to items 6, 7 and 8: the connection between outcome measures, sample size and study population. After all, performance measures and sampling should be in the toolbox of analysts as well.

If you’d like to learn more about the study protocol and all the topics covered within, I recommend going through [this short course](https://globalhealthtrainingcentre.tghn.org/study-protocol/) of the Global Health Training Centre, which is completely free. You’ll find more introductory courses on the website as well, completely worth it!

### Research methodology

Selecting the correct method supports the validity of the trial, by controlling bias and minimizing variation. Frequenty applied methods can be classified based on **allocation of participants** and according to **awareness** of either participants, researchers or both, in which group participants are allocated. Both techniques aim to decrease the potential for bias – a systematic deviation from the true result<sup>2</sup>. Let’s take a closer look what does that mean.

Based on allocation, there are two major categories:

- **Randomized controlled trials (RCTs)**: participants are randomly divided into groups: one receiving the treatment under investigation (also called experimental group) and the control group(s), receiving another treatment or placebo

- **Non-randomized studies**: participants are allocated to the experimental vs control groups by the investigator

Based on awareness, there are three major categories:

- **Open label**: both participants and investigators know, which treatment is being registered

- **Single-blind**: the participants don’t know whether they receive the treatment under investigation or not (other treatment or placebo)

- **Double-blind**: neither the participants nor the investigators know, which participants get which treatment. For ongoing analysis, treatment information (treatment name and amount of dose) is masked and only revealed once the study is over.

Additionally, interventional studies have a classification based on the number of treatments involved<sup>3</sup>:

- **Single-arm studies**: all the subjects receive the experimental treatment. In this type of studies, subjects are not randomized, thus usually the study is open label. It’s a common setup for Phase I and Phase II studies, when investigating the first in-human reaction. Usually, subjects receive periodically increased amount of the dose, until the maximum defined in the protocol. If they show adverse symptoms, the treatment will be decreased or interrupted.

- **Multi-arm studies**: the subjects are assigned or randomized to different groups. One group is the experimental arm (taking the drug of interest) while other groups (one or more) are the control arms. Phase III studies are usually multi-arm studies as the volume of data allows a detailed comparison of treatment arms considering effectiveness and safety outcomes.

Even if it seems logical at first that a randomized, double-blinded study will be bulletproof against bias, it’s not always necessary, as it increases the cost of the research and its interpretation is often complicated. Blinding is especially important in those studies, where the outcome measures are subjective, for example if the participant should indicate the level of pain. Nevertheless, no methodologies are perfect and free from error. If you’d like to read about the most common sources of error, I recommend reading [this article](https://journals.lww.com/anesthesia-analgesia/fulltext/2015/10000/clinical_research_methodology_1__study_designs_and.26.aspx) from Sessler and Imrey (2015).

Beside methodological errors, current reporting practices are surprisingly considered inadequate in many cases, such as in reporting details, like sample size calculation or how the random allocation sequence was generated<sup>4</sup>. This is how another guideline was born: the CONSORT Statement<sup>5</sup>. CONSORT stands for Consolidated Standards of Reporting Trials and it aims to establish the minimum requirements of reporting RCTs. If you’ll be involved in publishing the results, you should definitely review the 25-item checklist of CONSORT, which you can download from [this page](http://www.consort-statement.org/consort-2010).

Finally, if the study is blinded, usually you will report “Drug A” and “Drug B” in the output instead of the actual name of the test drug, the comparator drug or placebo. However, if adverse reactions are reported in the study, they must be investigated, especially if they are not expected side-effects of any involved drugs. These cases require the “unblinding” of the treatment as if they are caused by an active drug and not placebo they must be reported – and this is where the Data Safety Monitoring Board (remember the actors from [Part I article](/my-portfolio/blog/what-is-clinical-trial) !) comes in the picture, which, as an independent committee will evaluate the reported events and the safety of patients while keeping the study’s integrity<sup>6</sup>.

Alright, that’s it for this topic. From the next article on, data will be in focus. Check out the _Part III: A life cycle of clinical data_, where I write about the standards of data management and analysis!

Resources:

1. [The Study Protocol Part I and Part II online training](https://globalhealthtrainingcentre.tghn.org/study-protocol/), Global Health Training Centre
2. [Clinical Trial Designs, eupati.eu](https://www.eupati.eu/clinical-development-and-trials/clinical-trial-designs/)
3. [Randomized and Single-Arm Trials, focr.org ](https://www.focr.org/randomized-and-single-arm-trials)
4. Moher, David, Hopewell, Sally, Schulz, Kenneth F., Montori, Victor, Gøtzsche, Peter C., Devereaux , P. J., Elbourne, Diana, Egger, Matthias, Altman, Douglas G.: [CONSORT 2010 Explanation and Elaboration: updated guidelines for reporting parallel group randomised trials](http://www.consort-statement.org/Media/Default/Downloads/CONSORT%202010%20Explanation%20and%20Elaboration/CONSORT%202010%20Explanation%20and%20Elaboration%20-%20BMJ.pdf)
5. [CONSORT 2010, consort-statement.org ](http://www.consort-statement.org/consort-2010)
6. Francis, Gail and Wydenbach, Kirsty: [How to manage safety reporting in a blinded trial](https://mhrainspectorate.blog.gov.uk/2019/04/09/how-to-manage-safety-reporting-in-a-blinded-trial/)
