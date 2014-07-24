In this chapter we will explain the realization of the Frontend.


\section{The idea}

The application is divided into \emph{two parts}: the \emph{first part} is also viewable without logging in; the \emph{second part} is visible only after the authentication. 
\\In the first part, you can view general information about the application, along with information about those who built it and a tutorial to help you use the application. 
\\In the second part, instead, there are all the necessary view to perform operations that users can perform using the application.
\\
\\To implement the frontend we set goal: to \emph{have the most possible compatibility with any screen, at any resolution or aspect ratio}. To achieve this it was decided to use the Twitter \textbf{Bootstrap}, which greatly facilitates the work.

\newpage


\section{First part}

The first part of the application, as mentioned, is appointed to \emph{provide the basic informations} in order to facilitate the use of the services provided. It consists of the following pages:

\begin{itemize}
	\item \textbf{Home}
	\item \textbf{Login}
	\item \textbf{About us}
	\item \textbf{Info}
\end{itemize}


\subsection{Home}

This is the landing page, the first page that appears when you open the application.
\\It contains a link to the Login page and a link that allows you to contact an administrator to request an account if you do not have one.
\\From the graphical point of view, what is particularly noticeable is the background, consisting of a video that is an animation of a DNA strand.
\\
\\This is the code used to implement it:

\lstinputlisting{../public/system/views/index.html}


\subsection{Login}

This page is \emph{the most important of the first part of the application}, in fact it is the one that \emph{allows} a user with logon credentials \emph{to access the second part of the application}.
\\Its structure is very simple; it only consists of a form that contains the necessary fields to authenticate to the system.
\\
\\This is the code used to implement it:

\lstinputlisting{../public/auth/views/login.html}
	

\subsection{About Us}

This page is a sort of "self-congratulatory page"; in fact \emph{contains the description of one who has made ​​the application and of the person who commissioned it, the CSS Mendel}. 
\\On the page there is a button that allows you to contact technical support in case of problems with the application and another button, aimed primarily at technicians, which allows you to view the source code of the application using a GitHub repository. 
\\
\\This is the code used to implement it: 

\lstinputlisting{../public/system/views/aboutUs.html}


\subsection{Info}

The Info page provides \emph{general information about the application}, how it is structured and what you can do based on their level of authorization (admin user or licensed user). 



\section{Second part}

The second part of the application is the core. is structured by way of a \textbf{dashboard}, divided into several \textbf{tabs} that are visible only if you reach the required permission level. 
\\
\\The tab of which it is composed are the following:

\begin{itemize}
	\item \textbf{Home}
	\item \textbf{My Profile}
	\item \textbf{Execute Query}
	\item \textbf{Sequencing Upload}
	\item \textbf{Sequencing Upload History}
	\item \textbf{Authorize Users}
	\item \textbf{Families}
\end{itemize}

In particular, an Admin User can view all of the tabs, the Licensed User only the first three. 


\subsection{Home}

This page is the first page that appears immediately after login.
\\It is a \emph{welcome page for the user} and thus contains a greeting, the profile picture, and a suggestion on how to use the application. Regarding the image of the profile, the application refers to \textbf{Gravatar}; it is therefore necessary to have an account on the site or register a new one using the same email used for login to be able to have an image of the profile other than the default one. 
\\
\\This is the code used to implement it: 

\lstinputlisting{../public/dashboard/views/partial_views/partial-home.html}


\subsection{My Profile}

This page contains all the \emph{informations about the user logged in} at the time; there is also a link to another page where you can edit this informations.
\\
\\This is the code used to implement it: 

\lstinputlisting{../public/dashboard/views/partial_views/userProfile.html}


\subsection{Execute Query}

This view allows you to \emph{query the database}. It is possible to run two types of queries: simple queries and range queries.For this reason it is divided into two tabs. 
\\Once queried, at the bottom is shown a table containing the results of the query itself (for details on the query that you can do see previous chapters). 
\\
\\This is the code used to implement it: 

\lstinputlisting{../public/dashboard/views/partial_views/executeQuery.html}


\subsection{Sequencing Upload}

This view is probably the most important part of any application. In fact it is one that \emph{allows an administrator to load sequencing}, the datas that the application manages. 
\\To upload a file, simply drag and drop the file to be loaded into the panel pointed out; however, the panel will appear only after you specify the name of the patient and press the "OK" button. 
\\Once the loading is done, a table that displaying the contents of the file is shown. Next, you will be redirected to a view through which you can edit the information loaded and then save them. 
\\
\\This is the code used to implement it: 

\lstinputlisting{../public/dashboard/views/partial_views/uploadSequencing.html}


\subsection{Sequencing Upload History}

Basically, this page displays a table containing all the \emph{uploads that were made on the system}; so, for example, when you load an incorrect file, you can delete it using this table.
\\
\\This is the code used to implement it:


\lstinputlisting{../public/dashboard/views/partial_views/uploadHistory.html}


\subsection{Authorize Users}

Show a table of \emph{all members registered to the system}; you can register a new user, promote a user to the Admin role, demote a user to the Licensed role, filter users by means of a textbox. For each user is also shown his avatar, in addition to basic informations. 
\\
\\This is the code used to implement it: 


\lstinputlisting{../public/dashboard/views/partial_views/authorizeUser.html}


\subsection{Families}

Is the view that enables you to \emph{manage families} (groups of patients, relatives or not). All the actions actions you can do are performed by pop-up; you can: create a family, remove a family, modify a family, modify the members that make up the family. 
\\
\\This is the code used to implement it: 


\lstinputlisting{../public/dashboard/views/partial_views/families.html}
