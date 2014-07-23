In this chapter we will explain the realization of the interaction between application's Backend and Frontend.
\\The interaction occurs through the implementation of \textbf{RESTful APIs that allow to interact with a MongoDB instance}.

\section{The idea}

We built some APIs (one for each item that the application handles) that:

\begin{itemize}
	\item Handle CRUD for the item
	\item Use the proper HTTP verbs to make it RESTful (GET, POST, PUT, and DELETE)
	\item Return JSON data
	\item Log all requests to the console
\end{itemize}

All of this is pretty standard for RESTful APIs.

\newpage

\section{Implementation}

To realize APIs, we needed to: 

\begin{enumerate}
	\item define our Node packages
	\item define our models
	\item declare our routes using Express
	\item test our API
\end{enumerate}

\subsection{Node packages}

Node Packages are the list of the support packages that are used for the realization of the application; therefore it also contains the packages needed for the APIs. 
\\
\\This is our package.json file:

	@d {package.json} @[
		\lstinputlisting[firstline = 1, lastline = 44]{../package.json}
	@]

	@d {package.json - 2} @[
		\lstinputlisting[firstline = 44, lastline = 88]{../package.json}
	@]

	@d {package.json - 3} @[
		\lstinputlisting[firstline = 88, lastline = 97]{../package.json}
	@]

In our selection of packages, those necessary for the implementation of the APIs are:

\begin{itemize}
	\item \textbf{express}, the Node framework
	\item \textbf{mongoose}, the ORM we used to communicate with our MongoDB database
	\item \textbf{body-parser}, to pull POST content from our HTTP request
\end{itemize}

\subsection{Model}

Models required for the API are the same as those described in \emph{Chapter 2}, to which was added an additional model: \textbf{User}. It is necessary to be able to properly handle user information as well as the levels of privilege that a user owns. 
\\
\\This is the User model:

	@d {User's attributes} @[
		\lstinputlisting[firstline = 18, lastline = 57]{../server/models/user.js}
	@]

	@d {User's attributes - 2} @[
		\lstinputlisting[firstline = 58, lastline = 76]{../server/models/user.js}
	@]

	@d {User's validation} @[
		\lstinputlisting[firstline = 78, lastline = 114]{../server/models/user.js}
	@]
	@d {User's methods} @[
		\lstinputlisting[firstline = 115, lastline = 149]{../server/models/user.js}
	@]
	@d {User's methods - 2} @[
		\lstinputlisting[firstline = 150, lastline = 162]{../server/models/user.js}
	@]


\subsection{Routes}

We used an instance of the \emph{Express Router} to handle all of our routes.
\\Here is an overview of the routes we made, what they do, and the HTTP Verb used to access it. \emph{"model"} represent one of the models of our application.

\vspace{5mm}

\begin{tabular}{|l|l|rl|}
\hline
Route          &		 HTTP Verb        &		 Description		&       \\
\hline
/api/model 		&	GET       &		Get all the "model"       &      	\\
/api/model		&	POST       & 	Create a "model"       &     		\\
/api/model/:model\_id 	&	GET       & 	Get a single "model"       &     	\\
/api/model/:model\_id		&	POST       & 	Update a "model" with new info       &     	\\
/api/model/:model\_id		&	DELETE       & 	Delete a "model"       &     	\\
\hline
\end{tabular}

\vspace{5mm}

To achieve this, we used the package \textbf{MERS} (\emph{Mongoose Express Rest Service}): it is a plugin for express to expose mongoose finders as simple crud/rest operations.

\subsection{Tests}