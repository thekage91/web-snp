% SNP Web-portal
% D. Tosoni, D. Sicignani, U. Buonadonna
% Biomedical Informatics, 2014

# Project description

## Medical background
###**Single-Nucleotide Polymorphism**

DNA sequence variation occurring when a Single Nucleotide — A, T, C or G — in the genome (or other shared sequence) differs between members of a biological species or paired chromosomes.

\begin{center}
	\includegraphics[width=0.3\textwidth]{./images/Dna-SNP.png}
\end{center}

## Goal

\begin{center}
	\includegraphics[width=0.3\textwidth]{./images/imagesCAAF6KCZ.jpg}
\end{center}

Main target: **BIOLOGISTS**


Help them in their work of storing and retrieving Single Nucleotide Polymorphism genomics variants.

## How to reach it?
Realization of a **Web Portal**.
\vspace{7 mm}

###**Functionalities**
\vspace{3 mm}
*Super User:*

- create a "family" with one or more members
- authorize users
- modify inserted values

\vspace{2 mm}
*Authorized User:*

- search for a patient, gene, mutation, ...

# Project Structure
## Database:

###
\begin{center}
	\includegraphics[width=0.8\textwidth]{./images/Diagramma_Database.png}
\end{center}

## Database - Website interaction:

Occurs through queries that allow searching for:

- patient\'s SNPs 
- gene\'s SNPs
- region\'s SNPs
- all SNPs with certain Mutation, Genotype, Freq alt, ...
- patients with same SNP or Genotype
- SNPs within a genomic region
- specific SNP

## Website (User Interface):

\vspace{5mm}

Enables to load and retrieve data via a user interface that:

- allows biologists to use service as easily as possible, and...
- ...speed up their work.

\vspace{1.5mm}

\begin{center}
	\includegraphics[width=0.5\textwidth]{./images/User_PC.png}
\end{center}

# Use cases

## Use case diagram: Super User authorizes an User

###
\begin{center}
	\includegraphics[width=0.8\textwidth]{./images/Presentation_short_SSD_1.png}
\end{center}

## Use case diagram: Super User creates/populates a family

###
\begin{center}
	\includegraphics[width=0.55\textwidth]{./images/Presentation_short_SSD_2.png}
\end{center}

## Use case diagram: Super User loads data

###
\begin{center}
	\includegraphics[width=0.8\textwidth]{./images/Presentation_short_SSD_3.png}
\end{center}

## Use case diagram: Authorized User executes a query

###
\begin{center}
	\includegraphics[width=0.75\textwidth]{./images/Presentation_short_SSD_4.png}
\end{center}

# Software architecture and tecnologies

## To realize the project we will use:

###
\begin{center}
	\includegraphics[width=1\textwidth]{./images/Softwares.png}
\end{center}

## To realize the project we will use:

###
\begin{center}
	\includegraphics[width=1\textwidth]{./images/MEANSlide.png}
\end{center}

# Task breakdown

## Task breakdown:

- **Database**: Damian Tosoni, Ugo Buonadonna
- **Database - Website interaction**: Ugo Buonadonna, Davide Sicignani
- **Website**: Damian Tosoni, Davide Sicignani

<!-- pandoc -t beamer --slide-level 2 -V theme:CambridgeUS -s Presentation_short.md -o Presentation_short.pdf -->