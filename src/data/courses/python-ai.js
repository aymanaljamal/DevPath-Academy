window.ACADEMY_COURSES = window.ACADEMY_COURSES || {};

const pythonAiStages = [
  ['python-fundamentals','Python Fundamentals','أساسيات بايثون',['Setup, VS Code, and Jupyter','Variables, Types, and Operators','Input, Output, Conditions, and Loops','Functions and Scope','Lists, Tuples, Sets, and Dictionaries','Strings, Modules, and Packages','Files and Exceptions','Object-Oriented Programming','Virtual Environments, pip, and Dependencies','Fundamentals Mini Project']],
  ['advanced-python','Advanced Python','بايثون المتقدم',['Comprehensions, Lambda, map, filter, and reduce','Iterators and Generators','Decorators and Context Managers','Type Hints and Dataclasses','Regular Expressions','Testing with pytest','Clean Code Principles','REST APIs and JSON','Logging and Async Programming','Advanced Python Final Project']],
  ['math-for-ai','Mathematics for AI','الرياضيات للذكاء الاصطناعي',['Scalars, Vectors, and Matrices','Matrix Operations with NumPy','Calculus, Derivatives, and Gradients','Probability and Distributions','Statistics and Descriptive Measures','Correlation and Covariance','Loss Functions','Gradient Descent Visual Lab']],
  ['data-toolkit','NumPy, Pandas, and Data Visualization','نمباي وباندا وتصور البيانات',['NumPy Arrays, Indexing, and Slicing','Vectorized Operations','Pandas Series and DataFrames','Loading CSV and JSON','Exploring and Cleaning Datasets','Missing Values and Duplicates','Outliers and Data Transformation','Matplotlib and Seaborn','Exploratory Data Analysis','Real-World Data Analysis Project']],
  ['ml-fundamentals','Machine Learning Fundamentals','أساسيات تعلم الآلة',['AI vs ML vs Deep Learning','Supervised, Unsupervised, and Reinforcement Learning','Features, Labels, and Dataset Splits','Data Leakage','Overfitting, Underfitting, and Bias–Variance','Cross-Validation','Feature Engineering, Scaling, and Encoding','Scikit-learn Pipelines','Grid Search and Random Search','Model Evaluation, Selection, and Reproducibility']],
  ['regression','Regression Models','نماذج الانحدار',['Linear and Multiple Linear Regression','Polynomial Regression','Ridge, Lasso, and Elastic Net','K-Nearest Neighbors Regressor','Support Vector Regression','Decision Tree Regressor','Random Forest Regressor','Gradient Boosting and XGBoost Alternatives','MAE, MSE, RMSE, R², and Adjusted R²','Regression Model Comparison Lab','House Price Prediction Project']],
  ['classification','Classification Models','نماذج التصنيف',['Logistic Regression','K-Nearest Neighbors Classifier','Naive Bayes','Decision Tree Classifier','Random Forest Classifier','Support Vector Machine','Gradient Boosting, AdaBoost, and XGBoost Alternatives','Accuracy, Precision, Recall, and F1','Confusion Matrix, ROC, AUC, and Thresholds','Multiclass and Imbalanced Classification','Spam Detection Project','Customer Churn Prediction Project','Educational Disease Classification Project']],
  ['unsupervised','Unsupervised Learning','التعلم غير الخاضع للإشراف',['K-Means','Hierarchical Clustering','DBSCAN','Gaussian Mixture Models','PCA and Dimensionality Reduction','Isolation Forest and Anomaly Detection','Association Rules','Elbow Method and Silhouette Score','Customer Segmentation Project']],
  ['time-series','Time-Series Analysis and Forecasting','تحليل السلاسل الزمنية والتنبؤ',['Trend, Seasonality, and Stationarity','Moving Averages and Time Features','Time-Series Splits and Backtesting','ARIMA and SARIMA','Prophet Alternatives','Machine-Learning Forecasting','LSTM Forecasting Introduction','MAE, RMSE, and MAPE','Sales Forecasting Project']],
  ['nlp','Natural Language Processing','معالجة اللغة الطبيعية',['Text Cleaning and Tokenization','Stop Words, Stemming, and Lemmatization','Bag of Words and TF-IDF','Word Embeddings','Text Classification','Sentiment Analysis','Named Entity Recognition','Transformers and BERT Fundamentals','Traditional vs Transformer NLP Lab','Arabic and English Sentiment Project']],
  ['recommendations','Recommendation Systems','أنظمة التوصية',['Popularity and Content-Based Recommendations','Collaborative Filtering','User–Item Matrices and Memory-Based Methods','Matrix Factorization','Cold Start and Hybrid Systems','Precision@K and Recall@K','Course Recommendation Project']],
  ['deep-learning','Deep Learning with PyTorch','التعلم العميق باستخدام بايتورتش',['Tensors and Autograd','Neural Networks, Layers, Weights, and Biases','Forward and Backpropagation','Activations, Losses, and Optimizers','Artificial Neural Networks','Convolutional Neural Networks','RNN, LSTM, and GRU','Transfer Learning','Dropout, Batch Normalization, and Early Stopping','Saving and Loading Models','CNN Image Classification Project','Sequence Classification Project']],
  ['computer-vision','Computer Vision','الرؤية الحاسوبية',['Image Representation and Preprocessing','OpenCV Fundamentals','Data Augmentation','CNN Architectures and Transfer Learning','Object Detection and YOLO Introduction','Image Segmentation Fundamentals','Computer-Vision Metrics','Vision Application Project']],
  ['generative-ai','Transformers and Generative AI','المحولات والذكاء الاصطناعي التوليدي',['Attention and Transformer Architecture','Encoders, Decoders, BERT, and GPT','LLMs, Tokens, and Context Windows','Embeddings and Vector Databases','Semantic Search','Prompt Engineering','Retrieval-Augmented Generation','Fine-Tuning, LoRA, and PEFT','Hallucinations, Responsible AI, and Safety','Hugging Face Pretrained Models','Local Document RAG Pipeline','AI Document Assistant Project']],
  ['reinforcement-learning','Reinforcement Learning Fundamentals','أساسيات التعلم المعزز',['Agents, Environments, States, Actions, and Rewards','Policies and Markov Decision Processes','Exploration vs Exploitation','Q-Learning','Deep Q-Network Introduction','Simulated Agent Project']],
  ['mlops','Model Deployment and MLOps','نشر النماذج وعمليات تعلم الآلة',['Safe Model Persistence with joblib and pickle','FastAPI Inference APIs and Validation','Docker for Model Services','Logging and Experiment Tracking with MLflow','Model and Dataset Versioning','Monitoring, Data Drift, and Model Drift','Basic CI/CD and Cloud Fundamentals','FastAPI and Docker Deployment Project']],
  ['capstones','Portfolio-Ready Capstone Projects','مشاريع احترافية للملف الشخصي',['House Price Prediction Capstone','Customer Churn Prediction Capstone','Customer Segmentation Capstone','Sales Forecasting Capstone','Arabic Sentiment Analysis Capstone','Image Classification Capstone','Recommendation System Capstone','Fraud and Anomaly Detection Capstone','RAG Document Assistant Capstone','Final Assessment and Portfolio Launch']]
];

const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const modules = pythonAiStages.map(([id,title,titleAr,topics],stageIndex) => ({
  id,title,titleAr,
  lessons:[
    ...topics.map((topic,index)=>[slugify(topic),topic,{
      titleAr:`${titleAr}: الدرس ${index+1}`,
      duration:index===topics.length-1 && /Project|Capstone|Lab/.test(topic)?'120 min':'45 min',
      difficulty:stageIndex<2?'Beginner':stageIndex<11?'Intermediate':'Advanced',
      prerequisites:stageIndex===0?'None':pythonAiStages[Math.max(0,stageIndex-1)][1],
      kind:/Project|Capstone/.test(topic)?'project':/Model|Regression|Classifier|Machine|Forest|Bayes|K-Means|DBSCAN|ARIMA|LSTM|CNN|RNN|Transformer|BERT|Q-Learning/.test(topic)?'model':'lesson'
    }]),
    [`${id}-review`,`${title} Review`,{titleAr:`مراجعة ${titleAr}`,duration:'30 min',difficulty:'Review',prerequisites:title,kind:'review'}],
    [`${id}-assessment`,`${title} Assessment`,{titleAr:`تقييم ${titleAr}`,duration:'25 min',difficulty:'Assessment',prerequisites:title,kind:'assessment'}]
  ]
}));

window.ACADEMY_COURSES['python-ai'] = {
  id:'python-ai',slug:'python-ai',icon:'Py',color:'#d4a017',title:'Python, AI & Machine Learning',
  titleAr:'بايثون والذكاء الاصطناعي وتعلّم الآلة',shortTitle:'Python & AI',shortTitleAr:'بايثون والذكاء الاصطناعي',
  description:'A practical path from Python fundamentals through data science, comparative machine learning, PyTorch, generative AI, and production MLOps.',
  descriptionAr:'مسار عملي يبدأ بأساسيات بايثون ويتدرج إلى علم البيانات ومقارنة نماذج تعلم الآلة وبايتورتش والذكاء الاصطناعي التوليدي وعمليات النماذج.',
  level:'Beginner to advanced',duration:'220–280 hours',category:'ai',framework:'PyTorch',pythonVersion:'3.12+',seed:42,
  modules,
  tools:['roadmap','models','projects','datasets','cheatsheets','glossary','lab'],
  capstones:['House Price Prediction','Customer Churn Prediction','Customer Segmentation','Sales Forecasting','Arabic Sentiment Analysis','Image Classification','Recommendation System','Fraud and Anomaly Detection','RAG Document Assistant']
};
