# **Alexandria: Digital Thesis Repository**

## **Product Requirements Document (MVP Version)**

### **1\. Introduction**

Alexandria is a web-based thesis repository designed for the Computer Science Department. The platform centralizes departmental research outputs and provides students with a convenient way to discover, access, and learn from previous thesis projects. By combining thesis archiving with knowledge-sharing features such as recommendations and lessons learned, Alexandria aims to preserve institutional knowledge and support future researchers throughout the thesis development process.

---

### **2\. Problem Statement**

Although completed thesis papers are available through university archives, access is often inconvenient and time-consuming. Students frequently struggle to discover relevant previous work, identify viable research directions, and learn from the experiences of earlier thesis groups.

As a result, students may spend significant time searching for references, unknowingly duplicate existing ideas, or encounter avoidable challenges during development and defense. The department requires a centralized and searchable platform that makes previous research more accessible while preserving practical insights from past researchers.

---

### **3\. User Personas & Target Users**

#### **Current Students**

Students seeking thesis inspiration, related studies, and practical guidance from previous researchers.

#### **Thesis Advisers**

Faculty members responsible for evaluating research originality and advising student projects.

#### **Future Researchers**

Students and researchers interested in extending or building upon previous departmental work.

#### **Department Administrators**

Authorized personnel responsible for maintaining and managing repository records.

---

### **4\. Goals & Objectives**

#### **4.1 MVP Goal**

A student should be able to locate a relevant thesis within 30 seconds and understand whether it is useful to their research within 3 minutes.

#### **4.2 Success Criteria**

* Centralize departmental thesis records into a searchable repository.  
* Reduce the effort required to discover related research.  
* Improve student confidence during thesis topic exploration.  
* Preserve recommendations and lessons learned from previous thesis groups.  
  ---

  ### **5\. Functional Requirements**

  #### **5.1 Thesis Upload and Management**

Authorized administrators may upload and manage thesis records.

Each thesis record shall contain:

* Title  
* Authors  
* Year  
* Adviser  
* Department  
* Abstract  
* Keywords / Tags  
* PDF File or Repository Link  
* Awards and Conference Presentations (optional)  
* Recommendations for Future Researchers  
* Lessons Learned  
  ---

  #### **5.2 Thesis Repository and Discovery**

The platform shall provide a centralized repository where users can browse available theses through an organized and visually accessible interface.

Each thesis card shall display:

* Title  
* Authors  
* Year  
* Abstract Preview  
* Research Tags  
  ---

  #### **5.3 Search and Filtering**

Users shall be able to search theses using:

* Title  
* Author  
* Keywords  
* Year

Users shall be able to filter results by:

* Research Area  
* Adviser  
* Department  
  ---

  #### **5.4 Thesis Detail View**

Users shall be able to access a dedicated thesis page containing:

* Complete Metadata  
* Full Abstract  
* PDF Preview  
* Download Link (subject to repository policy)  
* Recommendations for Future Researchers  
* Lessons Learned  
* Related Theses  
  ---

  #### **5.5 Related Thesis Discovery**

The system shall recommend similar thesis projects based on shared tags, keywords, and research categories.

This feature assists students in identifying connected studies and potential areas for further exploration.

---

### **6\. Non-Functional Requirements**

#### **Usability**

The system shall prioritize simplicity and ease of navigation for students unfamiliar with academic repositories.

#### **Accessibility**

Users shall be able to access the platform through modern web browsers without requiring additional software installations.

#### **Performance**

Search results and thesis information should be retrievable within a few seconds under normal usage conditions.

#### **Maintainability**

The repository shall support future expansion without requiring major architectural changes.

---

### **7\. Project Scope**

#### **Included in MVP**

* Thesis repository  
* Upload and management system  
* Search and filtering  
* PDF viewing and access  
* Recommendations and lessons learned  
* Related thesis suggestions

  #### **Excluded from MVP**

* AI-generated summaries  
* AI-powered thesis recommendations  
* Research gap analysis  
* Student discussions and commenting  
* Semantic search  
* University-wide integration

These features are reserved for future versions of the platform.

---

### **8\. MVP Definition of Success**

Alexandria succeeds if students can quickly discover relevant thesis projects, understand their relevance, learn from previous researchers' experiences, and make more informed decisions regarding their own research directions.

