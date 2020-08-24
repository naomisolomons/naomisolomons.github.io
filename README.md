# Squamble

This is the repository for the quantum game 'Squamble' (originally called QFlow), submitted as part of the QE-CDT cohort project for Cohort 6. Further information about the game, including background Physics and how to play, can be found in the project report, or within the game itself.

## Repository contents

The 'index.html' file directs the GitHub pages to the homepage, which is 'index_v2.html'. It is recommended that Microsoft Edge is not used to play Squamble. This file then opens the appropriate pages, either for information ('About.html' or 'How_to_play.html') or game levels.

These levels are the html files 'Level_X.html', or 'Tutorial_X.html' which call the Javascript file 'Qflow.js', which provides the functionality of the game, and 'Level_X_data.js' which draws the appropriate starting graph.

These files import classes from the module 'Graph_Constructor.py', which uses Qiskit to generate the circuits that provide the data used as a basis to construct the levels.

Levels can also be generated using the file 'Rand_Gen.py', which creates circuits randomly.

The repository also contains music (.wav) and images (.jpg) for the game.

## Prerequisites

To get a copy running on your local machine for development and testing purposes, it is necessary to first install qiskit. Instructions for doing so can be found here: https://qiskit.org/documentation/install.html. Note that it is best to do so using Anaconda.

You will also need to change the path of some files in 'Stage_Selector_Interface.py'.

The game can be played either by running 'Stage_Selector_Interface.py' or the html file associated to the chosen level.

## Deployment 

We are hoping to release the game as an executable.

## Contributions

The code for this was written by Sam Mister and Naomi Solomons - please access the https://github.com/naomisolomons/qflow repository for a more accurate idea of author contributions.
