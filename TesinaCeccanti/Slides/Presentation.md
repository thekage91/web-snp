% Single Nucleotide Polymorphism
% D. Tosoni, U. Buonadonna, D. Sicignani
% Biomedical Informatics, 2014

# Introduction

## DNA
\vspace{5 mm}

In 1870, the Swiss chemist Miescher discovered inside the nucleus of a cell a giant
molecule: \textbf{deoxyribonucleic acid}.

\vspace{3 mm}

\textbf{Deoxyribonucleic acid (DNA)} is a molecule that encodes the genetic instructions used in the development and functioning of all known living organisms and many vi-ruses. DNA is a nucleic acid; together with proteins and carbohydrates, nucleic acids compose the three major macromolecules essential for all known forms of life.


## DNA components
Most DNA molecules consist of \emph{two biopolymer strands coiled around each other to form a double helix}. The two DNA strands are known as \textbf{polynucleotides} since they are composed of simpler units called \textbf{nucleotides}. Each nucleotide is composed of a \textbf{nitrogen-containing nucleobase}—either \textbf{guanine} (G), \textbf{adenine} (A), \textbf{thymine} (T), or \textbf{cytosine} (C)—as well as a monosaccharide sugar called \textbf{deoxyribose} and a \textbf{phosphate} group.

\vspace{1 mm}

The nucleotides are joined to one another in a chain by \emph{covalent bonds between the sugar of one nucleotide and the phosphate of the next}, resulting in an \emph{alternating sugar-phosphate backbone}.

\vspace{1 mm}

\textbf{Rules}: A with T and C with G.


## DNA structure
\begin{figure}[ht!]
	\centering
	\includegraphics[width=60mm]{../Images/DNA_double_helix.png}
	\label{overflow}
	\caption{DNA structure}
	\end{figure}


## Mutations
That said, it is easy to understand how DNA is important for life. For this reason, even a small mutation (a change of the nucleotide sequence of the genome of an or-ganism) can be decisive and cause diseases.

\vspace{3mm}

We will discuss a particular case of genomic mutation, the \textbf{Single Nucleotide Polymorphism}.


#Single Nucleotide Polymorphism

##Single Nucleotide Polymorphism: what is it?

\vspace{5mm}

A \textbf{Single Nucleotide Polymorphism (SNP)} is a DNA sequence variation occurring commonly within a population (e.g. 1 per cent) in which a Single Nucleotide — A, T, C or G — in the genome differs between members of a biological species or paired chromo-somes. 

## SNP example

\begin{figure}[ht!]
	\centering
	\includegraphics[width=50mm]{../Images/SNP_example.png}
	\label{overflow}
	\caption{SNP example}
	\end{figure}

## What can cause a SNP?

\vspace{5mm}

The main causes of a SNP are:

\vspace{3mm}

\begin{enumerate}
	\item natural selection, acting and fixating the allele of the SNP that constitutes the most favorable genetic adaptation
	\item like genetic recombination
	\item mutation rate
	\end{enumerate}

# The different possible types of SNPs

## What is a coding?

\textbf{Genetic Code}: it is the \emph{set of rules} by which information encoded within genetic material (DNA or even mRNA sequences) is \emph{translated} into proteins by living cells.

\vspace{1mm}

During the translation, the sequence of nitrogenous bases is treated in groups of three at a time (\textbf{codon}). The code defines how codons specify which amino acid will be added next during protein synthesis.


## The "original sin"

\vspace{3mm}

Generally, three-nucleotide codon in a nucleic acid sequence specifies a single amino acid. On the other hand, \textbf{a single amino acid can be specified by more than one codon}.


## 

\begin{figure}[ht!]
	\centering
	\includegraphics[width=50mm]{../Images/Amino_acids_table.png}
	\label{overflow}
	\caption{Amino acids}
	\end{figure}


## Types of SNPs

\vspace{5mm}
SNPs may fall within \emph{coding} sequences of genes, \emph{non-coding} regions of genes, as well as in the \emph{intergenic} regions (regions between genes).

## SNPs in the coding sequences

SNPs that fall in this category can be divided into two subcategories:

\begin{enumerate}
	\item Synonymous
	\item Nonsynonymous
	\begin{itemize}
	\item Missense
	\item Nonsense
	\end{itemize}
	\end{enumerate}

## Missense mutation - Example

Original DNA code for the amino acid sequence:

\vspace{1mm}

\begin{tabular}{|l|l|l|l|l|l|rl|}
\hline
C   A   T         &	C   A   T         &	C   A   T         &	C   A   T         &	C   A   T         &	C   A   T         &	C   A   T  	&       \\
\hline
\end{tabular}

\vspace{1mm}

Resulting amino acids:

\vspace{1mm}

\begin{tabular}{|l|l|l|l|l|l|rl|}
\hline
His         &	His         &	His         &	His         &	His         &	His         &	His  	&       \\
\hline
\end{tabular}

\vspace{5mm}

If we had, for example, a replacement of the eleventh nucleotide:

\vspace{1mm}

\begin{tabular}{|l|l|l|l|l|l|rl|}
\hline
C   A   T         &	C   A   T         &	C   A   T         &	C   \textbf{C}   T         &	C   A   T         &	C   A   T         &	C   A   T  	&       \\
\hline
\end{tabular}

\vspace{1mm}

Resulting amino acids will be:

\vspace{1mm}

\begin{tabular}{|l|l|l|l|l|l|rl|}
\hline
His         &	His         &	His         &	\textbf{Pro}         &	His         &	His         &	His  	&       \\
\hline
\end{tabular}

## Nonsense mutation - Example

Original DNA code for the amino acid sequence:

\vspace{1mm}

\begin{tabular}{|l|l|l|l|l|l|rl|}
\hline
A   T   G         &	A   C   T         &	C   A   C         &	C   G   A         &	G   C   G         &	C   G   A         &	A   G   C  	&       \\
\hline
\end{tabular}

\vspace{1mm}

Resulting amino acids:

\vspace{1mm}

\begin{tabular}{|l|l|l|l|l|l|rl|}
\hline
Met         &	Thr         &	His         &	Arg         &	Ala         &	Arg         &	Ser  	&       \\
\hline
\end{tabular}

\vspace{5mm}

If we had, for example, a replacement of the tenth nucleotide:

\vspace{1mm}

\begin{tabular}{|l|l|l|l|l|l|rl|}
\hline
A   T   G         &	A   C   T         &	C   A   C         &	\textbf{T}   G   A         &	G   C   G         &	C   G   A         &	A   G   C  	&       \\
\hline
\end{tabular}

\vspace{1mm}

Resulting amino acids will be:

\vspace{1mm}

\begin{tabular}{|l|l|l|l|l|l|rl|}
\hline
Met         &	Thr         &	His         &	\textbf{Stop}         &	            &	            &	     	&       \\
\hline
\end{tabular}

## SNPs not in coding regions

\vspace{2mm}

SNPs that are not in protein-coding regions may still affect:

\vspace{2mm}

\begin{enumerate}
	\item gene splicing
	\item transcription factor binding
	\item messenger RNA degradation
	\item \ldots
	\end{enumerate}

\vspace{2mm}

Gene expression affected by this type of SNP is referred to as an \textbf{eSNP} (\emph{expression SNP}).

# How to found SNPs: DNA sequencing

## DNA sequencing

\vspace{5mm}

\emph{“DNA Sequencing is the process of determining the precise order of nucleotides within a DNA molecule. It includes any method or technology that is used to determine the order of the four bases — adenine, guanine, cytosine, and thymine — in a strand of DNA.”}

## History of DNA Sequencing

\begin{figure}[ht!]
	\centering
	\includegraphics[width=75mm]{../Images/DNASequencing_history.png}
	\label{overflow}
	\caption{History of DNA Sequencing}
	\end{figure}

## Sequencing methods

Over the years, many methods have been developed for sequencing the DNA:

\vspace{1mm}

\begin{enumerate}
	\item \textbf{basic methods}, such as the \emph{Maxam-Gilbert sequencing} and \emph{Chain-termination methods}
	\item \textbf{advanced methods}, such as the \emph{Shotgun sequencing} or \emph{PCR Bridge}
	\item \textbf{next-generation methods}, such as \emph{Massively Parallel Signature se-quencing (MPSS), Polony sequencing, 454 pyrosequencing, Illumina (Solexa) sequencing, SOLiD sequencing, Single Molecule Real Time (SMRT) sequencing, ...}
\end{enumerate}

## Next-Generation Sequencing

Nowadays, thanks to technological progress we pushed further forward. It is possible to sequence \textbf{more than 100 million base pairs in about a week} (generating a very high amount of data).
\linebreak
This is called the \textbf{Next-Generation Sequencing}.

\vspace{2mm}

However, the higher the speed of sequencing, the more there is a problem:  \textbf{interpretation}. It often represents a real bottleneck; a single computer is not able to interpret a sequencing at the same speed of which it is presented to him.

\vspace{2mm}

\textbf{Solution}: \emph{cloud computing}.

##

\begin{figure}[ht!]
	\centering
	\includegraphics[width=110mm]{../Images/NowadaysSequencing.png}
	\label{overflow}
	\caption{Nowadays Sequencing}
	\end{figure}

## 

\begin{figure}[ht!]
	\centering
	\includegraphics[width=110mm]{../Images/NGSworkflowCommented.png}
	\label{overflow}
	\caption{NGS work-flow}
	\end{figure}

## Whole Exome Sequencing

- The type of sequencing used to obtain the data that our web-app manages.

- The \textbf{Whole Exome Sequencing} test is a highly complex test that is newly developed

- In contrast to "common" sequencing tests that analyze one gene or small groups of related genes at a time, the WES test analyze the \emph{exons or coding regions of thousands of genes simultaneously} using next-generation sequencing techniques.

\hspace{5mm}
\emph{Exome}: portion of the human genome that contains functionally important sequences of DNA that direct the body to make proteins essential for the body to function properly

## Whole Exome Sequencing

- It is known that \textbf{most of the errors that occur in DNA sequences that then lead to genetic disorders are located in the exons}. Therefore, sequencing of the exome is thought to be an efficient method of analyzing a patient's DNA to discover the genetic cause of diseases or disabilities.
- WES includes a \textbf{mitochondrial genome sequencing}. (Mitochondria: structures within cells that convert the energy from food into a form that cells can use). 

# Data Format

## CSFASTA

The sequencer that generates the data managed by our web-app provides the results of the sequencing using format \textbf{CSFASTA}

\vspace{5mm}

###>MCHU - Calmodulin - Human, rabbit, bovine, rat, and chicken
ADQLTEEQIAEFKEAFSLFDKDGDGTITTKELGTVMRSLGQNPTEAELQD
\linebreak MINEVDADGNGTID
FPEFLTMMARKMKDTDSEEEIREAFRVFDKDGNGYISAAELRHVMTNLGEKLTDEEVDEMIREA
DIDGDGQVNYEEFVQMMTAK*

# SNP Databases

## Why databases?

Because SNPs are expected to facilitate large-scale association genetics studies, there has recently been great interest in SNP discovery and detection. For this reason databases can to serve as a central repository. Once discovered, polymorphisms could be used by additional laboratories, using the sequence information around the polymorphism and the specific experimental conditions.

## Most important DBs

\begin{enumerate}
	\item \textbf{dbSNP}, a SNP database from the \emph{National Center for Biotechnology Infor-mation (NCBI)}
	\item \textbf{SNPedia}, a wiki-style database supporting personal genome annotation, interpretation and analysis
	\end{enumerate}

## Support DBs

Furthermore, there are various support database that allow, for example, to bind a SNP to the disease that causes:

\begin{enumerate}
	\item \textbf{OMIM} database describes the association between polymorphisms and diseases (e.g., gives diseases in text form)
	\item \textbf{Human Gene Mutation Database} provides gene mutations causing or associ-ated with human inherited diseases and functional SNPs
	\item \textbf{GWAS Central} allows users to visually interrogate the actual summary-level association data in one or more genome-wide association studies
	\item \ldots
	\end{enumerate}

<!-- pandoc -t beamer --slide-level 2 -V theme:CambridgeUS -s Presentation_short.md -o Presentation_short.pdf -->