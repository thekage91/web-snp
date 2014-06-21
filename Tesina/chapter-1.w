



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
 
\newpage

Let us look at the components:

\paragraph{Attributes}      

	@d {Variant's attributes} @[
		\lstinputlisting[firstline = 12, lastline = 37]{../server/models/variant.js}
	@]

	@<Variant's attributes@>

\begin{itemize}
	\item \textbf{chr}: it is a five-character string that ... {Mazza's help needed...}
 	\item \textbf{start, end}:  integers that describe the coordinate of the mutation within the chromosome; if they match, it means that we have a punctiform mutation
	\item \textbf{ref}: represents the correct bases, as they would be if there were no mutation
   	\item \textbf{alt}: represents what we actually find due to the mutation; a "." or a "-" represent a deletion, while a sequence, for example CTTG..., represents an insertion
\end{itemize}

\paragraph{Relationships}   
\begin{itemize}
	\item \textbf{gene}: links the variant with the gene affected by the mutation
	\item \textbf{pathogenicity}: describes the variant pathogenicity, that is if the variant cause diseases or not
  	\item \textbf{patients}: links to patients affected by this varant
  	\item \textbf{dbSNPs}: connects the variant to its dbSNPs
  	\item \textbf{esps}: ... \textbf{Mazza's help needed...}
  	\item \textbf{sequencings}: all sequencings affected by this variation
\end{itemize}


\subsection{Family}
A Family represents a set of one or more patients (modeled in patient schema). It can be created only by an user with admin privileges. This schema allow to group patients with similar genomic mutations as well as real families (father, mother, son{...}).
\\Here it is the code to implement the family object: 

\lstinputlisting{../server/models/family.js}

Let us look at the components:

\paragraph{Attributes}      
\begin{itemize}
 	\item \textbf{name}: describes family's name
\end{itemize}

\paragraph{Relationships}   
\begin{itemize}
 	\item \textbf{patients}: links family to its members
\end{itemize}



