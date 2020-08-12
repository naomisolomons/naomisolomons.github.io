# qflow

This is the repository for the quantum game 'QFlow', submitted as part of the QE-CDT cohort project for Cohort 6. Further information about the game, including background Physics and how to play, can be found in the project report, or within the game itself.

## Repository contents

'Stage_Selector_Interface.py' produces the user interface. This opens the appropriate level in a web browser. 

These levels are the html files 'Qflow_LevelX.html', which call the Javascript file 'Qflow.js'. This is the longest file and provides the functionality of the game.

Note that 'Stage_Selector_Interface.py' contains almost all of the functionality of 'Stage_Selector.py'. These files will be merged later on in the project. These files import classes from the modules 'Qflow_Level_Builder.py' and 'Graph_Constructor.py'. These use qiskit to generate the circuits that provide the data used as a basis for to construct the levels.

Levels can also be generated using the file 'Rand_Gen.py', which creates circuits randomly.

## Prerequisites

To get a copy running on your local machine for development and testing purposes, it is necessary to first install qiskit. Instructions for doing so can be found here: https://qiskit.org/documentation/install.html. Note that it is best to do so using Anaconda.

You will also need to change the path of some files in 'Stage_Selector_Interface.py'.

The game can be played either by running 'Stage_Selector_Interface.py' or the html file associated to the chosen level.

## Deployment 

We are hoping to release the game as an executable.
