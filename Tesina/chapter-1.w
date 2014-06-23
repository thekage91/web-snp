



In this chapter we will explain the creation of the database, from code point of view as well as from design point of view.
\\The \textbf{database} is the core part of the back end of the application, because it is the structure that keeps stored all the data necessary for the operation of the portal. Because of its importance, we spent much of our time to decide its structure (tables, relationships, multiplicity, ...) and only after a thorough analysis of results we moved to implementation.
\\
\\As explained in the introductory chapter, the software implementation of database was performed using \textbf{MongoDB} through \textbf{Mongoose} (a MongoDB object modeling tool).
\\MongoDB is an open-source document database, and the leading NoSQL database. It is based on \emph{Document-Oriented Storage} and unlike SQL databases, where you must determine and declare a table's schema before inserting data, MongoDB’s collections do not enforce document structure. This flexibility facilitates the mapping of documents to an entity or an object.
\\Mongoose helps to have a more efficient management of the objects; in fact, using mongoose's schemas to define database's objects, permits to treat database's models as commons JavaScript's objects.
\\
\\Throughout the chapter, we will see the objects that compose the model of our database, but, first of all, let us focus on the syntax used to communicate with MongoDB and Mongoose.

\section{Mongoose's syntax}
To realize an object using mongoose, we need to follow a specific syntax.
\\First of all, we should place all files related to the models (one file for each model) in a specific folder of the project; this folder is as follows:
\\
\\/server/models
\\
\\At the beginning of each file, we have to inform the database that all data passed to builders, but that are not present in the schema that we will define below, must not be stored.
\\To do this we use the following line of code:

	@[
		\begin{lstlisting}
		'use strict';
		\end{lstlisting}
	@]

Next, we must specify needed \emph{modules dependencies}. In our project, we have to insert the dependency from mongoose and crypto (a module for encryption of information):

	@[
		\begin{lstlisting}      
		var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		crypto = require('crypto');
		\end{lstlisting}
	@]

Now we move to define the \emph{schema}, specifying all necessary components (attributes and relationships). Note that MongoDB will automatically add an ID field to each schema and assigns it using an internal policy.
\\
\\For example, if we want to model a \emph{User} with an attribute \emph{name} of type \emph{string}:

\newpage

	@d {Example schema} @[
		\begin{lstlisting} 
		UserSchema = new Schema ({
		  	/ / attribute
		  	name: {
		         		type: String,
		         		required: true,
		         		validate: [validatePresenceOf, 'Name can not be blank']
		     	},

		    	/ / relationship
		   	patiens: [{
		   		type: Schema.Type.ObjectId,
		   		ref: 'Patient'
		   	}]
		); 
		\end{lstlisting}
	@]

Next, we can define a number of \emph{additional features} to our model, such as:

\begin{itemize}
	\item \textbf{Validations}: functions called to validate a set of attributes or data specified by the programmer
	\item \textbf{Virtuals}: virtual attributes, not persisted
	\item \textbf{Pre-save hooks}: functions called at the time immediately before the model is saved to the database
	\item \textbf{Methods}: all methods needed for the operations on our model 
\end{itemize}

Finally, we must specify the actual name of the model described by the schema specified as previously shown:

\begin{lstlisting}
	mongoose.model ('User', UserSchema);
\end{lstlisting}

%\newpage

\section{Model Schemas}
These are the model schemas that compose our database.


\subsection{Variants}
The model \emph{Variant} represents the key concept that we want to represent in our work: \textbf{genomic variants}.
\\This table will always be accessed during any kind of consultation, in fact are variants what biologists are looking for or insert through the portal.
\\The centrality of the concept and, therefore, of the table is also demonstrated by the fact that in the database schema (see chapter \emph{Introduction}) Variant table is linked to almost all the other tables.
\\
\\Let us look at the code components:

\newpage

\paragraph{Attributes}      

	@d {Variant's attributes} @[
		\lstinputlisting[firstline = 11, lastline = 37]{../server/models/variant.js}
	@]

\begin{itemize}
	\item \textbf{chr}: it is a five-character string describing the chromosome affected by the variation
 	\item \textbf{start, end}:  integers that describe the coordinate of the mutation within the chromosome; if they match, it means that we have a punctiform mutation
	\item \textbf{ref}: represents the correct bases, as they would be if there were no mutation
   	\item \textbf{alt}: represents what we actually find due to the mutation; a "." or a "-" represent a deletion, while a sequence, for example CTTG..., represents an insertion
\end{itemize}

\paragraph{Relationships}  

	@d {Variant's relationships} @[
		\lstinputlisting[firstline = 40, lastline = 71]{../server/models/variant.js}
	@]

\begin{itemize}
	\item \textbf{gene}: links the variant with the gene affected by the mutation
	\item \textbf{pathogenicity}: describes the variant pathogenicity, that is if the variant cause diseases or not
  	\item \textbf{patients}: links to patients affected by this varant
  	\item \textbf{dbSNPs}: connects the variant to its dbSNPs
  	\item \textbf{esps}: Exome Sequencing Project
  	\item \textbf{sequencings}: all sequencings affected by this variation
\end{itemize}


\subsection{dbSNP}
\emph{dbSNP} is the key concept of the database, that is the \textbf{Single Nucleotide Polymorphism Database} (a free public archive for genetic variation within and across different species developed and hosted by the \emph{National Center for Biotechnology Information (NCBI)} in collaboration with the \emph{National Human Genome Research Institute (NHGRI)}).
\\
\\Let us look at the code components:

\paragraph{Attributes}      

	@d {dbSNP's attributes} @[
		\lstinputlisting[firstline = 11, lastline = 29]{../server/models/dbSNP.js}
	@]

\begin{itemize}
 	\item \textbf{dbSNP}: identifier of the variation in the dbSNP database
 	\item \textbf{freqAlt}: frequency of the alternative allele (variant) in the population 1000 Genomes
 	\item \textbf{freqRef}: frequency of the reference allele
\end{itemize}

\paragraph{Relationships} 

	@d {dbSNP's relationships} @[
		\lstinputlisting[firstline = 31, lastline = 37]{../server/models/dbSNP.js}
	@]

\begin{itemize}
 	\item \textbf{variants}: links dbSNP to its variants
\end{itemize}


\subsection{Gene}
A \emph{Gene} is the molecular unit of heredity of a living organism. Genes hold the information to build and maintain an organism's cells and pass genetic traits to offspring. All organisms have genes corresponding to various biological traits, some of which are instantly visible, such as eye color or number of limbs, and some of which are not, such as blood type, increased risk for specific diseases, or the thousands of basic biochemical processes that comprise life.
\\
\\Let us look at the code components:

\paragraph{Attributes}      

	@d {Gene's attributes} @[
		\lstinputlisting[firstline = 11, lastline = 32]{../server/models/gene.js}
	@]

\begin{itemize}
 	\item \textbf{gene}: identifier of the gene
 	\item \textbf{region}: the region in which the gene is located
 	\item \textbf{mutation}: the mutation that affects the gene
 	\item \textbf{annotation}: any annotations
\end{itemize}

\paragraph{Relationships} 

	@d {Gene's relationships} @[
		\lstinputlisting[firstline = 34, lastline = 40]{../server/models/gene.js}
	@]

\begin{itemize}
 	\item \textbf{variants}: links gene to its variants
\end{itemize}


\subsection{Pathogenicity}
\emph{Pathogenicity} indicates whether a mutation is pathogenic (able to create damages to the organism) or not.
\\
\\Let us look at the code components:

\paragraph{Attributes}      

	@d {Pathogenicity's attributes} @[
		\lstinputlisting[firstline = 11, lastline = 53]{../server/models/pathogenicity.js}
	@]

\begin{itemize}
 	\item \textbf{SIFT, polyPhen, mutationTaster, mutationAssessor}: all four are predictors of pathogenicity of the mutation. The numbers are the scores of the pathogenicity.
 	\item \textbf{GERPpp, pyoloP, SiPhy}: all three are predictors of conservation of the mutation. The numbers are the scores of conservation.
\end{itemize}

\paragraph{Relationships} 

	@d {Pathogenicity's relationships} @[
		\lstinputlisting[firstline = 55, lastline = 61]{../server/models/pathogenicity.js}
	@]

\begin{itemize}
 	\item \textbf{variant}: links pathogenicity to its variant
\end{itemize}


\subsection{Sequencing}
\emph{DNA Sequencing} is the process of determining the nucleotide order of a given DNA fragment. The sequence of DNA encodes the necessary information for living things to survive and reproduce, so determining the sequence is therefore useful in fundamental research into why and how organisms live, as well as in applied subjects.
\\
\\Let us look at the code components:

\paragraph{Attributes}      

	@d {Sequencing's attributes} @[
		\lstinputlisting[firstline = 11, lastline = 91]{../server/models/sequencing.js}
	@]

\begin{itemize}
 	\item \textbf{patientId}: identifier of the patient.
 	\item \textbf{date}: the date when sequencing was performed.
 	\item \textbf{patientHealthStatus}: if the patient is diseased or not.
 	\item \textbf{sequencerName}: name of the sequencer.
 	\item \textbf{sequencerModel}: model of the sequencer.
 	\item \textbf{referenceGenome}: the reference genome.
 	\item \textbf{qual}: describes the quality of the sequencing.
 	\item \textbf{filter}: reference allele.
 	\item \textbf{genotype}
 	\item \textbf{genotypeQuality}: quality of the genotype.
 	\item \textbf{readsDepth}: the depth of the reads.
 	\item \textbf{ref}: string that indicates whether the quality of the variant is good (PASS).
 	\item \textbf{altFilterReads}: number of reads that do not contain the mutation to their inside.
 	\item \textbf{genotypeLikelihood}: probability that the determined genotype is correct.
 	\item \textbf{haplotypeScore}: indicate the presence of misaligned reads in the neighborhood of the variant.
 	\item \textbf{strandBias}: all four are predictors of pathogenicity of the mutation.
\end{itemize}

\paragraph{Relationships} 

	@d {Sequencing's relationships} @[
		\lstinputlisting[firstline = 55, lastline = 61]{../server/models/sequencing.js}
	@]

\begin{itemize}
 	\item \textbf{variants}: links sequencing to its variants
\end{itemize}


\subsection{ESP}
\emph{ESP} is the part of the database that represents locally the interesting portion of the database of the \textbf{Exome Sequencings Project}, the goal of which is to discover novel genes and mechanisms contributing to heart, lung and blood disorders by pioneering the application of next-generation sequencing of the protein coding regions of the human genome across diverse, richly-phenotyped populations and to share these datasets and findings with the scientific community to extend and enrich the diagnosis, management and treatment of heart, lung and blood disorders.
\\
\\Let us look at the code components:

\paragraph{Attributes}      

	@d {esp's attributes} @[
		\lstinputlisting[firstline = 11, lastline = 27]{../server/models/esp.js}
	@]

\begin{itemize}
 	\item \textbf{ESP6500\_ALL}: frequency of the mutation in the EVS database and in the overall population
 	\item \textbf{ESP6500\_AA}: frequency of the mutation in the EVS database and in the American/African population
 	\item \textbf{ESP6500\_EA}: frequency of the mutation in the EVS database and in the European /American population
\end{itemize}

\paragraph{Relationships} 

	@d {esp's relationships} @[
		\lstinputlisting[firstline = 29, lastline = 35]{../server/models/esp.js}
	@]

\begin{itemize}
 	\item \textbf{variants}: links esp to its variants
\end{itemize}


\subsection{Patient}
A \emph{Patient} describes a patient in the real world. Can only be created by a user with Admin privileges.
\\
\\Let us look at the code components:

\paragraph{Attributes}      

The Patient object has no attributes to be specified; it only has an identifier (\textbf{ID})that is added from MongoDB by default.

\paragraph{Relationships} 

	@d {Patient's relationships} @[
		\lstinputlisting[firstline = 11, lastline = 25]{../server/models/patient.js}
	@]

\begin{itemize}
 	\item \textbf{variants}: links patient to its variants
 	\item \textbf{family}: links patient to its family
\end{itemize}


\subsection{Family}
A \emph{Family} represents a set of one or more \emph{patients} (modeled in patient schema). It can be created only by an user with admin privileges. This schema allow to group patients with similar genomic mutations as well as real families (father, mother, son{...}).
\\
\\Let us look at the code components:

\paragraph{Attributes}      

	@d {Family's attributes} @[
		\lstinputlisting[firstline = 11, lastline = 18]{../server/models/family.js}
	@]

\begin{itemize}
 	\item \textbf{name}: describes family's name
\end{itemize}

\paragraph{Relationships} 

	@d {Family's relationships} @[
		\lstinputlisting[firstline = 20, lastline = 26]{../server/models/family.js}
	@]

\begin{itemize}
 	\item \textbf{patients}: links family to its members
\end{itemize}


\subsection{User}
The \emph{User} object describes a user of the system, a \emph{biologist} who accesses the portal to carry out one of the supported operations (described in the introductory chapter).
\\
\\Let us look at the code components:

\paragraph{Attributes}      

	@d {User's attributes} @[
		\lstinputlisting[firstline = 18, lastline = 56]{../server/models/user.js}
	@]

These attributes are all self-explanatory.

\paragraph{Methods} 

	@d {User's validation} @[
		\lstinputlisting[firstline = 10, lastline = 16]{../server/models/user.js}
	@]
	@d {User's methods} @[
		\lstinputlisting[firstline = 58, lastline = 138]{../server/models/user.js}
	@]


Functions performed by these methods are explained in the code comments.