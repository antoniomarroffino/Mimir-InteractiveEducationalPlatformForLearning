% Classe supsistudent
% versione 0.02, 27 settembre 2012
% Autore: Amos Brocco <amos.brocco@supsi.ch>
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{supsistudent}[2012/09/27 v0.02 SUPSI Student,
amos.brocco@supsi.ch]

% Modifiche impaginazione
% Autori: Mikol Faro e Sandra Gabaglio <sandra.gabaglio@supsi.ch>


% Package di base
\LoadClass[11pt]{book}
\usepackage[italian]{babel}
%\usepackage[paper=a4paper,top=4.0cm,bottom=2cm,left=3cm,right=2cm]{geometry}
\usepackage[paper=a4paper,top=4.0cm,bottom=3cm]{geometry}
\usepackage[utf8]{inputenc}
%\usepackage{slantsc}
\usepackage{array}
\usepackage{amsmath}
\usepackage{titlesec}

% Font (Helvetica, simile a Arial)
\usepackage[T1]{fontenc}
\usepackage[scaled]{helvet}

% Spaziatura
\usepackage{setspace}

% Referenze
\usepackage{varioref}

% Figure
\usepackage{graphicx}

% Bibliografia
%\usepackage{natbib}

% Per adattare margini
\usepackage[strict]{changepage}

% Per test
\usepackage{lipsum}

% Footer logo
\usepackage{eso-pic}

% Numero pagine
\usepackage{lastpage}

\assignpagestyle{\chapter}{fancy}

% Comandi
\makeatletter
	\newcommand{\titolo}[1]{\def \@titolo {#1}}
	\newcommand{\studente}[1]{\def \@studente {#1}}
	\newcommand{\relatore}[1]{\def \@relatore {#1}}
	\newcommand{\correlatore}[1]{\def \@correlatore {#1}}
	\newcommand{\committente}[1]{\def \@committente {#1}}
	\newcommand{\corso}[1]{\def \@corso {#1}}
	\newcommand{\modulo}[1]{\def \@modulo {#1}}
	\newcommand{\anno}[1]{\def \@anno {#1}}
	\studente{}
	\relatore{}
	\correlatore{}
	\committente{}
	\corso{}
	\modulo{}
	\anno{} 
\makeatother

\newcommand{\linea}[0]{\vspace*{2em}\noindent\makebox[\linewidth][l]{\rule{\textwidth}{1pt}}\hspace*{\fill}\\}

% Formattazione predefinita
\renewcommand{\rmdefault}{ptm} % Times
\renewcommand{\sfdefault}{phv} % Helvetica
\renewcommand{\ttdefault}{cmtt}
\renewcommand{\familydefault}{\sfdefault} % Font standard per il documento
%\titleformat{\chapter}{\Huge}{\thesection}{18pt}{}
%\titleformat{\section}{\large\bfseries}{\thesubsection}{11pt}{}
%\titleformat{\subsection}{\large\bfseries}{\thesubsubsection}{10pt}{}
%\titleformat{\paragraph}{\large\bfseries}{\paragraph}{9pt}{}
%\renewcommand{\normalsize}{\fontsize{11pt}{11pt}\fontseries{m}\selectfont}
\newcommand{\etichettetitolo}{\fontsize{8pt}{8pt}\fontseries{m}\selectfont}
\newcommand{\nomititolo}{\vspace{1em}\fontsize{14pt}{14pt}\fontseries{bx}\selectfont}
\setlength\parindent{0pt}
\setlength{\headsep}{40pt}
\setlength{\headheight}{17pt}


\makeatletter
\newcommand{\campo}[1]{\ifx {#1} \@empty
					--
				\else
					\nomititolo{{#1}}
				\fi}
\makeatother				

%\renewcommand{\chaptermark}[1]{\markboth{\thechapter.\space#1}{}} 


% Intestazione e pié di pagina
\makeatletter
	\usepackage{fancyhdr}
	\pagestyle{fancy}
	\renewcommand{\headrulewidth}{1pt}
	\renewcommand{\footrulewidth}{1pt}
	\fancyhf{}
	\fancyhead[LO]{
	  \includegraphics[width=70mm]{logoheader}
	}
	\fancyhead[RE]{ 
		\leftmark
	}
	\setlength{\footskip}{50pt}
	\fancyfoot[LE]{
	    \small{\@titolo} \AddToShipoutPicture*{\put(58,28){\includegraphics[height=44mm]{logoverticale}}}
                %\small{\@title} \AddToShipoutPicture*{\put(58,154){\scalebox{-1}{\includegraphics[height=44mm]{logoverticale}}}}
	}
	\fancyfoot[RO]{
	  %\small{\@title} \AddToShipoutPicture*{\put(527,154){\scalebox{-1}[-1]{\includegraphics[height=44mm]{logoverticale}}}}
	      \small{\@titolo} \AddToShipoutPicture*{\put(527,28){{\includegraphics[height=44mm]{logoverticale}}}}
	}
	\fancyhead[LE, RO]{
	 % \small{\thepage/\pageref{LastPage}}
		 \small{\thepage}
	}
	%\fancyhead[RO]{
	 % \small{\thepage/\pageref{LastPage}}
	%}
\makeatother

\renewcommand{\chaptermark}[1]{ \markboth{#1}{} }
% Pagina titolo
\makeatletter
\def \maketitle {%
	\begin{titlepage}
	% Allinea a sinistra
	\raggedright
	% Intestazione SUPSI e logo
	\vspace{20mm}
	{\parindent-1mm\makebox(0,0)[lb]{\includegraphics[width=170mm]{logoprima}}}
	\\
	{\Huge \textrm{\@titolo}} \\
	\vspace{10mm}
	\linea
		\begin{minipage}[t]{0.49\textwidth}
			\begin{flushleft}
				\etichettetitolo{Studente/i} \\
				\campo{\@studente}
			\end{flushleft}
		\end{minipage}
		\hspace*{\fill}
		\begin{minipage}[t]{0.49\textwidth}
			\begin{flushleft}
				\etichettetitolo{Relatore} \\
				\campo{\@relatore} \\
				\linea
				\vspace*{0.3em} % Fix spaziatura
				\etichettetitolo{Correlatore} \\
				\campo{\@correlatore} \\
				\linea  
				\vspace*{0.3em} % Fix spaziatura
				\etichettetitolo{Committente} \\
				\campo{\@committente} \\	
			\end{flushleft}
		\end{minipage} \\
		\vspace{5mm}		
		\linea
		\begin{minipage}[t]{0.49\textwidth}
			\begin{flushleft}
				\etichettetitolo{Corso di laurea} \\
				\campo{\@corso} \\
			\end{flushleft}
		\end{minipage}
		\hspace*{\fill}
		\begin{minipage}[t]{0.49\textwidth}
			\begin{flushleft}
				\etichettetitolo{Modulo} \\
				\campo{\@modulo} \\
			\end{flushleft}
		\end{minipage} \\
		\vspace*{1em} 
		\linea
		\vspace*{0.3em}
		\etichettetitolo{Anno} \\
		\campo{\@anno} \\
 		\vfill

 		\begin{minipage}[b]{0.49\textwidth}
 		\begin{flushleft}
 		\linea
 		\vspace*{0.3em} % Fix spaziatura
	 	\etichettetitolo{Data} \\
	 	\campo{\@date} \\
 		\end{flushleft}
 		\end{minipage}
 		\hspace*{\fill}
 		
 		% \begin{minipage}[b]{0.49\textwidth}
 		% \begin{flushright}
 		\leavevmode\makebox(0,0){\put(434,180){\includegraphics[height=71mm]{logoverticale}}}
 		% \end{flushright}
 			
 		% \end{minipage}
		
		%Aggiunge una pagina bianca senza header e footer dietro la copertina
		\newpage
		\thispagestyle{empty}
		\mbox{}
		\newpage
	\end{titlepage}
	\setlength{\voffset}{-15mm}
	\singlespacing
}
\makeatother