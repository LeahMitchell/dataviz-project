## Final Video:
https://youtu.be/dl8bcqDelLA

## Final Website (with updated writing): 
https://leahmitchell.github.io/dataviz-project/

# Data Visualization Project

As some one who got obsessed with Marvel during the pandemic (like 'create an excel spreadsheet of each movie with its rating' level obsessed), I knew that the project for data visulization (WPI CS 573) had to be something that I could obsess over. So, I choose Marvel. 

## Data
I was able to find a pretty extensive dataset on Kaggle that detailed information about all the characters from the comic books. For each character it contains information such as gender, race, skin color, eye color, and alignment. There are numeric based power measurements (such as strength, inteligence, or speed) that cumulate into a total score. There is also many specific super powers (stealth, weapons master, or super strength) that are in a binary format for each character.

For data cleaning, luckily only a few modificiations were needed. First, some gender information was blank, so were filled after a few google searches and the Marvel Wiki page. Second, any characters that did not contain data for each of the numeric based power measurements were filtered out as there was no realiable way to fill in that information. Lastly, for each of the specific super powers, a columns was created for a list of each characters powers. 

Gist Link:
https://gist.github.com/LeahMitchell/8ad46fbcac8d7420bcd5b97b1a245f43

## Prototypes

Currently, there are a few in-progress prototypes for this project. 

The most flushed out design thus far is a scatterplot of the numeric power values, sized by the total power value. This visualization also allows used the capabilities to highlight points to determine the character's name and the ability to choose the X and Y axis values. Most recently, a voroni graph was added to the scatterplot to make highlight character names easier and the ability to choose a character to highlight was added. Future iterations of this graph will be the ability to zoom in on the points and the ability to highlight points under a specific alignment.

"https://vizhub.com/LeahMitchell/325e9b3bedcd4fc7953f4dc1607f2f5a?mode=embed"

Another visualization that is in progress is a radar graph that will show the relationship of a charaters numeric power values. The radar chart allows users to pick which character they are interested in seeing and the color changes based on character alignment along with the total power value at the bottom. 

https://vizhub.com/LeahMitchell/12732aef9fd54f20ab0e9d080c6cca46?mode=embed


The last two prototype inlcude a very simple bar chart of the number of characters for each alignment and a very simple donut chart of alignment of characters with a specific categorical power. Future iterations of the bar chart will include more specifics into the makeup of each bar, for example the gender or race breakdown of each bar. Future iterations of the donut char would to be have the menu work and have multiple donuts on one graph. These chart are the least prioritized due to the reinvisioned final product described below. 

"https://vizhub.com/LeahMitchell/8b04fa1b1f9d467d9c79152421120b17?mode=embed"


"https://vizhub.com/LeahMitchell/36c9facc28864543bef4e8009a67b452?mode=embed"


## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * What numeric or categorical strength is more prevelant across the characters? 
 * Who are the strongest characters (by total numeric strength/powers or by total categorical powers or by both) overall and what is their alignment? 
 * What are some of the general trends across the genders, powers, race against general count of characters per alignment?
 * For each character, what is a general make up of their abilities? 

Other questions that would be nice to answer if extra time: 

* Following up on strongest, what are some of the patterns or characteristics of the strongest or weakest characters?
* Do certain numerical power scores correlate to specific categorical powers?
* What are the various patterns in gender, numeric and categorical powers for teams (i.e. original avengers), partners (i.e. Falcon and Winter Solider), and enemies (i.e. Ironman and Thanos)

While not all of these questions will be answered at the end of the project, the goal is to have these questions guide the development and iteration of each visualization. 

## Sketches
Below is an example of my personal favorite 4 sketches from the brainstorming assignment, sketched out in a little more detail/color. There are many more visualizations that I would want to create and would love to have a a full page of Marvel vis for fans to geek out over. The end goal would to have all graphs on a github website and strung together to create a narative about Marvel. 

1. This graph is a spider graph to help detail the relationship between numerical power values for a character. The coloring of the graph would be based on the alignment and there would be a info box to the side to help detail a little more about the character. A more advanced goal of this graph would be the ability to layer multiple characters on the same graph or have multiple spider graphs in the same window. 
2. This graph is a interactive scatterplot where users can change the x and y axis to be the various numerical power values. The points would be colored by alignment and character name would appear. (See prototypes)
3. This bar graph would detail the average numerical power values for each categorical power. So, the average values for all characters with a power, such as stealth, would be displayed. There would be around 3 total categorical powers displayed on one plot with drop down menus to choose which powers the user wants to display. Another advanced goal would to have other stats displayed when hovering over the bars. 
4. Lastly, this graph is an example of a more static graph. These pie (or donut) charts would show the proportion of good vs bad character that have a specific categorical power. The size of the pie chart would be based on the total number of characters that have that power. This graph could also benefit from interation 


![image](https://github.com/LeahMitchell/dataviz-project/blob/master/Stealth-1.png)

## Reinvisioned Final Product

After discussing with Professor Kelleher, the final direction has changed from the above sketches. The final project will be a two sided visualization with a scatterplot on the left and a radar chart on the right. The scatterplot will be much like the one previously discussed with better tooltip interactions and the radar chart will also be like the one currently developed with the ability to choose which character. The two interactions will be linked so as a user "finds" a character on the scatterplot, the radar chart will update to show the corresponding radar chart. In reverse, as a character is chosen on the radar chart, the characters scatterplot value will be highlighted on the scatterplot.

If time allows, other visualizations will be developed to support this main visualization such as the previously mentioned bar graph. 

## Open Questions

This project has taught me more about javascript and developing graphs than I was expecting. While I am already proud of the progress I have on the project thus far, there is still so much I want to do. I am hoping that I will have more time at the end of the project to give time to develope more than the two-sided graphic discussed above. I am currenlty most nervous about the combination of the scatter and radar plots and what errors could ensue from that. 


## Schedule

For the schedule, I based everything on a weekly schedule of 'to-do's, so all tasks under one week should take approximately a week to do. 

10/18: (Break) Lightly work on building up current prototypes
* Donut chart needs to be fixed

10/25: Get each visualization to have visual encodings:
 * Donut chart approrpiately sized and colored
 * Bar chart broken down into sub categories
 * Radar chart colored, possibly adding info box

11/1: Add at least one interation per visualization
* Menu and hovering for donut chart
* Menu and hovering for bar chart
* Menu for Radar chart

11/8: Add other visuals if time, otherwise continue to develop images
* Fix any bugs 
* Determine current schedule and add another visualization if ahead

11/15: Continue iterating on work, last week to add new visual
* Make sure all interations are working
* Add other interations for radar, such as two charts at once

11/22: (Thanksgiving week) User feedback on 'final draft' (from family/friends)
* Collect feedback from users to determine if graphs make sense
* Get user experience specifically about interations 


11/29: Github page/website up and running, same general formating across visualizations
* Build up website for final narative of visualizations
* Determine final color scheme, fonts, etc for all visuals  

12/6: Last minute toches/last iterations
* Fix any last minute bugs
* User feedback round 2

12/10 Final Deliverable

## Iterations

10/26: Addressing Project Feedback:

* Restructed radar code to be in seperate js file
* Worked with creating multiple radar graphs on one plot (ultimate goal of showing all characters' radar graphs)
* Colored radar graphs by character side
* Plot character names on scatterplot 
* Attempted: updating menu for choosing character for radar graph
* Attempted: adding character names onto brushing scatterplot as well

Radar Chart: https://vizhub.com/LeahMitchell/a73e10b87b774375890bb56de2ff7162

![image](https://github.com/LeahMitchell/dataviz-project/blob/master/radar_it_1.PNG)

Scatterplot: https://vizhub.com/LeahMitchell/75c74ab6bd824e34be0feed0e92867fd?file=index.js

![image](https://github.com/LeahMitchell/dataviz-project/blob/master/scatter_it_1.PNG)

11/10:

The radar chart is now working to allow users to change the character based on what they are interested in. See below for the link to the radar chart. 

https://vizhub.com/LeahMitchell/12732aef9fd54f20ab0e9d080c6cca46

11/8:

* radar chart refactoring
* Menu working on radar chart

11/16:

* Voroni graph is working!
* cleaned up data
* character selection on scatterplot working!
* fixed tooltip error on radar chart
* total power score on bottom of radar chart
* edited README

12/1:

* Both graphs are on the same plot!!!
* Each work with the menu interations as well 
* I got some feedback from a friend have a "laundry" list of what I need to work on found in the readme!
* I've been fighting with making updatable axis labels so that the x and y axis are a little more understandable
* I also looked at making the name visble when selected but my current attempts haven't worked thus far, still trying tho!

Here is the updated combined chart link: 
https://vizhub.com/LeahMitchell/369be3627211463fba6b94f06f4c3ccc?edit=files&file=scatterPlot.js


![image](https://github.com/LeahMitchell/dataviz-project/blob/master/current_status_12_1.PNG)


12/9: 

* Finalized any small things from last week
* Adding in second character option
* Built website
* Submitted project!

## Final Project

For the final project, I was able to build a Github page instead of using this README.md. I wanted to do this to have one cleaned place that has all of the visualizations embedded and is more presentable to add to my LinkedIn page. I have updated this readme a little bit, but didn't add things like screenshots since I embedded everthing in the page instead. 

