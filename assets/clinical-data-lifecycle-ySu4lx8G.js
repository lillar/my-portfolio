var e=`---
title: "Part III: A life cycle of clinical data" 
keywords:
	- clinical research
	- trials
	- data analysis
	- clinical data
	- CDISC
	- Clinical Data Interchange Standards Consortium
	- SDTM
	- PRM
	- ADaM
tags: 
	- clinical trials
	- data standards
	- SDTM
	- ADaM
category: Clinical Trials
date: 2020-12-14
time: 11:00:00
clearReading: true
thumbnailImage: datalifecycle.png
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

**_The bits & bytes of clinical studies_**

 <!-- more -->

I will always have good memories about that first meeting a few years ago, which inspired a blog series and I wrote about in [this article](/my-portfolio/blog/unknown-territory-clinical-trials). When someone asks me, how would I describe the challenges of the industry an analyst will face with, I’d say the most difficult parts are probably to identify the responsibilities of the actors involved and who you can address with different questions, to understand the jargon and to understand the unique data structure. I consider myself as an outsider – I did not participate in planning nor carrying out a study ever. My job was to elaborate on the pain points of the study team and support the medical monitoring activities through BI. But how could you improve someone’s work if you don’t know what they are talking about, right?

If you read [Part I](/my-portfolio/blog/what-is-clinical-trial) and [Part II](/my-portfolio/blog/clinical-trials-protocol) before, I hope, you feel more confident with the industry already. From Part III, focus will be on **data**. This article will cover some aspects of clinical database design, data collection and clinical data management (CDM). It’s a crucial step to plan them in detail to ensure high-quality data, as later changes in the system will increase the project cost and might cause data loss.

### The dawn of Clinical Data Interchange Standards Consortium

Till today, development in computing shaped and improved data management procedures: it provides now an easy access to data and significantly improves the reporting capabilities. But only if the data structure is well devised.

**Database design** is the process of organizing and storing the data in an efficient manner, to prevent data redundancy and poor performance. Selecting the software system depends on what functionality it fulfills and the type of data it stores. In case of clinical trials, data is traditionally stored in a relational database, where datapoints are grouped into different tables based on a logical structure<sup>1</sup>. Datapoints in different tables are related to each other and can be easily retrieved together within one query. The database should be carefully designed and documented separate in the data management plan and summarized in the study protocol.

Through time, the way of **data collection** advanced as well. Instead of paper-based forms, now many of the studies record participants’ information through an electronic data capture (EDC) system using electronic case report forms (eCRF). The eCRF is filled by the investigators, when participants come to their visits, when captured data gets directly uploaded to the database. Another version of CRF must be prepared in parallel, called annotated case report form (aCRF), which maps the questionnaire fields to the corresponding variable in the database for documentation purpose.

In case you were thinking, that’s not the only source of data, not at all. Today, trials generate a huge volume and variety of data both from operational and patient perspective, just think about wearables and mobile applications the patients can use and transfer data 24/7. So, the idea would come naturally, why not to leverage big data technologies to decrease the “burden” of a relational database? Well, there are companies who also identified the opportunity years ago, but you see that the pharma industry is not really known about quickly adopting new technologies. In another article, I’ll summarize the landscape of data sources and emerging technologies tackling the challenge of accessing synchronized and standardized data from different sources, real-time.

But now, I’m returning a bit to the history of data captured through EDC.

Despite all the technological improvements, data management strategies were yet not harmonized between companies, therapeutic areas or even countries, which made the results incomparable even in the ‘90s. To overcome this issue, research experts started working on providing guidelines to advance clinical reporting data standards. Enter CDISC, the **Clinical Data Interchange Standards Consortium**.

> **What are the benefits of implementing CDISC standards?**
>
> - Improved data quality
> - Complete traceability of data
> - Consistent terminologies across studies to facilitate integrated analyses
> - Streamlined processes
> - Facilitated sharing among partners and with authorities
> - Reduced costs

CDISC is a global, non-profit organization with the purpose to develop and advance data standards to create transparency and clarity in clinical research. They help with transforming incompatible formats and inconsistent methodologies into a standard framework, ensuring compliance with regulatory requirements.

They support achieving these goals with the guidelines available in their suite of Foundational Standards. As they describe on their [website](https://www.cdisc.org/standards/foundational):

> “CDISC Foundational Standards are the basis of the complete suite of standards, supporting clinical and non-clinical research processes from end to end. Foundational Standards focus on the core principles for defining data standards and include models, domains and specifications for data representation.”<sup>2</sup>

In the clinical research process, they provide guidelines in the following steps of data management\\*:

![Data management steps supported by CDISC standards](flowchart.png "Data management steps supported by CDISC standards")<br>

1. Protocol planning and design
2. Data collection
3. Data tabulation
4. Data analysis

\\*CDISC provides data collection and presentation standards for nonclinical studies, called SEND which is an implementation of the CDISC data tabulation guideline, SDTM. In this article, I won’t detail SEND, as this article is focusing on clinical studies, e.g. experiments with human volunteers. You can find the documentation of the latest SEND Implementation Guide (SENDIG) version [here](https://www.cdisc.org/standards/foundational/send).

And now let’s go back to the clinical research process and review each of them briefly, as working with clinical data requires the in-depth knowledge of CDISC – especially the data tabulation and data analysis standards.

#### 1. Planning: Protocol Representation Model (PRM)

The PRM is a study protocol standard, that identifies and describes more than 100 common elements in protocols and the relationships between them. As the study protocol itself is an extensive document stored in .doc or .pdf format, it’s readable for human but can’t be used to programmatically retrieve essential information – for example, the defined inclusion/exclusion criteria.

PRM offers a Domain Analysis Model to store protocol components in a database instead and provides a conceptual set of requirements in a structured format (XML) which is readable for machine. It collects the model of objects or entities along with their descriptive types, attributes and relationships<sup>3</sup>. In a nutshell, its purpose is to facilitate protocol development using metadata, so that protocol elements can be repurposed and reused saving significant resources.

PRM is well described on CIDSC website, so if you are interested in this topic, you can download the documentation from [this site](https://www.cdisc.org/standards/foundational/prm/prm-v10). Please note, that all the guidelines are free to access on the website, but you need to register first.

#### 2. Data collection: Clinical Data Acquisition Standards Harmonization (CDASH)

We all know the popular phrase in computing: _“garbage in, garbage out”_. This applies in clinical data as well: the quality of raw data will determine the reliability of the outcome measures. The outcome measures are essential in a clinical study, as they assess the impact of an intervention – basically they supposed to answer the primary research questions, so I will dedicate an entire post to this topic, but let’s stick to data capture for now.

CDASH establishes a consistent way to collect data across studies and sponsors as it provides a guideline for developing the common sections of the case report forms (CRF). It also describes the method of organizing questionnaire fields and labeling data items. The last version defines standard domains categorized in 4 general groups<sup>4,5</sup>:

- **Interventions**: domains collecting data of any treatment or procedure that is intentionally registered during the trial. It can include patients’ Exposure (EX) and Concomitant Medications (CM) as well.
- **Events**: domains collecting occurrences, which are not tied to any schedule during the study, such as side-effects (called Adverse Events (AE)) or the treatment termination details (called Disposition (DS)).
- **Findings**: domains capturing information of investigational evaluations. Data can be measured once at screening or repeatedly (Laboratory Test Results (LB), Vital Signs (VS) etc.) which support the safety monitoring of participants as well.
- **Special Purpose**: domains which have a specific structure and a standard set of variables specified in CDISC, which can’t be modified. Demographics (DM) domain belongs to this class.

Beside the data domains, CDASH specifies the importance of each data collection field in the CRF as well by classifying as:

<table style="font-size:12px;">
<tr>
<th>CDASHIG Core</th>
<th>Examples from Demographics table</th>
</tr>
<tbody>
<tr>
<td>Highly Recommended (HR):<br>
a field which should always be part of the CRF (either due regulatory requirement or in order to create a meaningful dataset)</td>
<td><b>Subject Identifier for the study (SUBJID)</b>

Uniquely identifies the subject. Directly mapped to its SDTMIG variable (SUBJID). </td>

</tr>
<tr>
<td>Recommended/Conditional (R/C):<br>
a field which should be part of the CRF if met with certain conditions</td>
<td><b>Birth Date (BRTHDAT) or Birth Year (BRTHYY)</b>

Eventually, we need the age of the subject, but due regulatory reasons the format might differ (example: BRTHDAT storing date in DD-MON-YYYY format or each component of date/time separately like BRTHYY for year). Final output should be mapped to the SDTMIG variable BRTHDTC. </td>

</tr>
<tr>
<td>Optional (O):<br>
a field which is available for use </td>
<td><b>Age (AGE)</b>

If collected on the CRF explicitly, it can be directly mapped to its SDTMIG variable AGE.

If age is collected, its unit and the collection date should be stored as well. Why is it optional? Because age might be needed to recalculate based on the reference time (like the age at screening might differ from the age at the first dose) </td>

</tr>
</tbody>
<table>

CDASH relates strongly with the other standards detailed in the upcoming sections, the Study Data Tabulation Model (SDTM) and the Analysis Data Model (ADaM):

- SDTM demonstrates the database design aligned with regulatory submission requirements
- CDASH standards are a subset of SDTM, which ensure relevant data collection with no redundancy
- ADaM provides dataset and metadata standards to perform and review statistical analyses with possibility to trace back the data to SDTM

It seems that all roads lead to Rome... or rather, to SDTM. So, let’s see why SDTM seems to be the core of CDISC standards!

#### 3. Data tabulation: Study Data Tabulation Model (SDTM)

Recognizing its advantage, from 2004 tabulation data of clinical trials must be submitted according to the SDTM standards to FDA (US) and from 2016 to PMDA (Japan). As CDISC summarizes:

> “SDTM provides a standard for organizing and formatting data to streamline processes in collection, management, analysis and reporting”.

Ok, wait a minute. I was a bit troubled here at first: SDTM defines the database design and how to organize data in a structure, but in its name, tabulation could refer to an aggregated format of data – so which one is it now? Well, in my understanding you could gain guidance for both. While primarily SDTM defines the standard domains and datasets, variables and record identifiers in each dataset, it can be used directly for analysis (and tabulation within) if no further calculations are necessary. If further derivation should be applied for analysis, read further and learn about the ADaM (or anyways, just read further😀).

Uhm, and did you stop for a second when I said “SDTM defines the standard domains and datasets” and think what the difference is between those two? In CDISC documentations you might find these terms using with the same nomenclature, but we can distinguish them. The term “dataset” refers to a single file with structured data, where each record represents an observation, and columns collect attributes of the observation. The term “domain” refers to a collection of logically related observations in a particular topic, which observations are registered to all the participants. One section above, you were reading about the 4 classes of standard domains in CDASH (Interventions, Events, Findings and Special Purpose). In Findings, Lab results is a good example of a domain. As the domain itself is huge – taking blood chemistry, hematology, urinalysis and other tests – it consists of multiple CRFs/datasets. In SDTM, these datasets are compiled in one table labeled as LB, where test topics are differentiated by a grouping qualifier column. In other cases, one dataset can be equivalent with one domain itself, like Demographics, labeled as DM which collects all the related data in a single file<sup>6</sup>.

As for variables, the [SDTM documentation](https://www.cdisc.org/standards/foundational/sdtm/sdtm-v1-8) provides a general framework for each of the classes, how information should be organized. It describes each of the columns and their roles as well<sup>7</sup>:

- **Identifier variables**: columns uniquely identifying a record
- **Topic variables**: columns specifying the scope of the observation (like treatment name at Interventions class)
- **Timing variables**: timing of the observation (can be date, time, date and time)
- **Qualifier variables**: all additional columns describing results and traits of an observation
- **Rule variables**: expressing an algorithm or executable method

Let’s have an example here, as for me it’s always easier to understand these high-level concepts introduced through plain terms.

Sticking with Lab results: now we have one domain in SDTM, with the standard label LB. We know that data is collected in the forms per test category on a specific visit. So, at each visit of the participant we’ll have a set of blood chemistry test results (similarly for hematology and other tests). All the entered data will be compiled in a single table: LB. Here I’m cherry picking a set of columns with specific roles, which are frequently used for further analysis:

- Identifier variables: study id, study site id, subject id, domain id, record id or sequence number
- Topic variables: lab test name
- Timing variables: visit number, visit name, start date/time of the observation, end date/time of the observation
- Qualifier variables: category, result, unit, normal range – lower limit, normal range – upper limit
- Etc.

Each of these columns have their standard label, like _- -ORRES_ stands for the Result or Finding in Original Units, which is basically the measurement value of a test. “- -” before a variable name is replacing the domain name: in case of lab, it will be _LBORRES_, while in case of vital signs data (domain labeled as VS), it will be _VSORRES_.

Finally, let’s look at the granularity of the data, where I’m differentiating 3 levels (similar to CDASH domains, but rather to capture the granularity of one record rather than the purpose of it):

- **Subject-level data**: one row in the dataset per participant, for example in Demographics.
- **Event-level data**: just like the Events domain indicates, each row in the dataset represents one occurrence. One participant can report multiple occurrences or none.
- **Visit-level data**: data collected at the scheduled evaluations, such as Exposure (treatment-related data) and data in Findings domain (Lab, Vitals, ECG etc.). One row in the dataset represents one visit and the measures in topic of interest: for example in vital signs, the systolic blood pressure of the participant at Week 1 visit would be one row, while the weight measurement for the same participant at Week 1 would be another row, as the visit name, the parameter (test name), the measurement value and unit are all stored in a their dedicated columns.

#### 4. Data analysis: Analysis Data Model (ADaM)

As I mentioned above, researchers can use SDTM datasets directly for analysis, if no further derivation is required, but that’s rarely the case. By nature, SDTM stores raw data as collected, where imputation of missing values or any transformation are not allowed<sup>8</sup>. Thus, a new set of data should be derived from SDTM for statistical analysis, and that’s called ADaM.

As an example: if your primary measure would be the change of the body mass index (BMI) from the baseline – e.g. before the intervention started – you would have the weight measured at each visit and the height at the first visit (as it doesn’t really vary) and stored as raw data in SDTM in the VS domain. That would not be enough though for analysis, as you need at least five derivations to apply:

1. Identify whether the participant indeed entered the study and received the intervention
2. Ensure that height is expressed in cm and weight in kg
3. Identify baseline height and weight
4. Calculate the BMI at each visit
5. Calculate the change from baseline at each visit

These variables can be derived from SDTM and added as new columns next to the existing ones in the ADaM dataset. However, to trace the origin of any variable, SDTM and ADaM datasets are differentiated by name. As an example: vital signs data is named as VS in SDTM and ADVS in ADaM, using the _“AD- -”_ prefix for analysis data in the latter. Similarly, adverse events dataset is named as AE in SDTM and ADAE in ADaM. One domain won’t follow this schema though: demographics data you’ll find under DM in SDTM, but ADSL (Subject-level Analysis) in ADaM.

ADaM documentation also provides a section for derivation rules commonly applied in clinical trials, including the above example as well. You can access the documentation from [this page](https://www.cdisc.org/standards/foundational/adam/adam-implementation-guide-v1-2-release-package). After downloading the zip file, go to _/ARM-for-Define-XML/adam//define2-0-0-example-adam-results.html_. Here you’ll find Analysis Derivation.

This example file will be called the Case Report Tabulation Data Definition Specification (CRT-DDS) or rather simply, the _“define.xml”_ in your project, which should be submitted along the analysis datasets for review. We could consider it as the core documentation of the statistical analysis procedure, as it provides the traceability to SDTM variables, defines the new variables along with their derivation rules and more for data reviewers.

### Summary of data flow

Well, did I loose the focus or how do all these terms and standards actually form a data pipeline? I think this would be (again) a great time to use flow charts! Here is a quick recap, how the different steps follow each other in the life cycle of clinical data:

![Data management steps of clinical trials](flowchart_allsteps.png "Data management steps of clinical trials")<br>

### Last thoughts for an already long post

I mentioned in the intro, how important data quality is and by now you probably feel that data is super over-standardized if a trial conforms with CDISC standards. What I haven’t mentioned yet, thats both SDTM and ADaM have an extensive list of validation rules, which ensures that datasets and analyses are regulatory-compliant. They are available in the documentation, but if you are eager to figure right now, what those rules might be, there is a [great collection](https://www.pinnacle21.com/validation-rules/sdtm) in the Community section of pinnacle21.com. So, it’s beneficial to incorporate the standards early in the trial.

I know this was a lot, and thank you, if you kept reading till this point. Digging to the bottom of clinical trials requires perseverance, and I’m sure you have more questions if not just being more confused. To help you, I’ve summarized some of the useful documents below for the first time you got to work with ADaM datasets, as I think, they’ll shed light on the essentials of the data structure you are dealing with. Remember, all the documentations are free to access on CDISC website, but you must register first:

- [CDASH Implementation Guide](https://www.cdisc.org/system/files/members/standard/foundational/cdash/CDASHIG%20v2.1.pdf): you’ll find questionnaires for the basic set of data collection as well as annotated case report forms, including data collection fields with details of domain, importance and implementation note examples
- [SDTM Implementation Guide](https://www.cdisc.org/standards/foundational/sdtmig/sdtmig-v3-3/html#Submitting+Data+in+Standard+Format): while SDTM documentation itself describes the general conceptual model, SDTMIG extends that knowledge with assumptions, business rules and examples for preparing ADaM datasets
- [ADaM define.xml example file](https://www.cdisc.org/standards/foundational/adam/adam-implementation-guide-v1-2-release-package): this is a notable example of the final datasets, business rules and relation of datapoints

Finally, [SAS](https://www.sas.com/en_us/home.html) is industry-leading in life sciences analytics, and in many cases, SAS programming knowledge is required for the job. Therefore, the company aims to provide many guidance documents regarding the industry, data management and reporting as well – you'll find many references in my articles too. As for repeating the main take away, I recommend reading the [beginner’s guide](https://www.sas.com/content/dam/SAS/support/en/sas-global-forum-proceedings/2018/1759-2018.pdf) from their content.

You are on a great journey, with a super-rich data source! When you realize that you are not looking at some data anymore, but you've connected the dots. there will be your chance to sneak-peak in potential cures of some yet untreated diseases. I found the revelation to be a game changer and I hope, you’ll find these articles useful to find your path too. 😊

Resources:

1. [What Is a Relational Database?, oracle.com](https://www.oracle.com/database/what-is-a-relational-database/)
2. [Standards, cdisc.org](https://www.cdisc.org/standards)
3. [The Protocol Representation Model v1.0, cdisc.org](https://www.cdisc.org/system/files/members/standard/foundational/protocol/protocol_representation_model_version_1.0.zip)
4. Gaddale, Jagadeeswara Rao: [Clinical Data Acquisition Standards Harmonization importance and benefits in clinical data management](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4640009/), Perspect Clin Res. 2015 Oct-Dec; 6(4): 179–183.
5. [SDTM, wikipedia.org](https://en.wikipedia.org/wiki/SDTM)
6. [Domain vs. Dataset: What’s the Difference?, cidsc.org](https://www.cdisc.org/kb/articles/domain-vs-dataset-whats-difference)
7. [SDTM v1.8, cdisc.org](https://www.cdisc.org/standards/foundational/sdtm/sdtm-v1-8)
8. [Study Data Technical Conformance Guide](https://www.fda.gov/media/88173/download); FDA, 2018 March
`;export{e as default};