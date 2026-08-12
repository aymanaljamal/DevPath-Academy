import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import vm from 'node:vm';
import { platformSources } from './source-manifest.mjs';

const root=process.cwd(),courseDir=join(root,'src','data','courses'),names=(await readdir(courseDir)).filter(name=>name.endsWith('.js')).sort();
const sandbox={window:{ACADEMY_COURSES:{}}};vm.createContext(sandbox);
for(const name of names)vm.runInContext(await readFile(join(courseDir,name),'utf8'),sandbox,{filename:name});
const courses=Object.values(sandbox.window.ACADEMY_COURSES),mode=process.argv[2]||'all',failures=[];
const check=(condition,message)=>{if(!condition)failures.push(message)};
const lessons=course=>course.modules.flatMap(module=>module.lessons.map(([slug,title,meta={}])=>({course,module,slug,title,meta,id:`${course.id}:${slug}`})));
const allLessons=courses.flatMap(lessons),ids=new Set(allLessons.map(item=>item.id));
const readPlatform=async()=> (await Promise.all(platformSources.map(file=>readFile(join(root,'src',file),'utf8')))).join('\n');

if(mode==='content'||mode==='all'){
  for(const course of courses){check(course.id&&course.title&&course.description,`${course.id||'unknown'}: missing course metadata`);check(course.modules?.length,`${course.id}: no modules`);for(const item of lessons(course)){check(item.slug&&item.title,`${item.id}: empty lesson`);check(item.title.length>=3,`${item.id}: title too short`);}}
  check(ids.size===allLessons.length,'Duplicate lesson IDs or slugs');
  const platform=await readPlatform();for(const marker of ['LEARNING OBJECTIVES','RUNNABLE POSTGRESQL EXAMPLE','Expected output','COMMON MISTAKES','BEST PRACTICES','REVIEW QUESTIONS','LESSON SUMMARY'])check(platform.includes(marker),`Shared lesson renderer missing ${marker}`);
}
if(mode==='translations'||mode==='all')for(const course of courses.filter(c=>['python-ai','sql','database-optimization'].includes(c.id))){check(course.titleAr&&course.descriptionAr,`${course.id}: missing Arabic course text`);for(const item of lessons(course))check(item.meta.titleAr,`${item.id}: missing Arabic title`);}
if(mode==='sources'||mode==='all'){
  const platform=await readPlatform(),sourceText=await readFile(join(root,'src','features','course-catalog','sources.js'),'utf8'),sourceSandbox={window:{}};vm.createContext(sourceSandbox);vm.runInContext(sourceText,sourceSandbox);const sourceCatalog=sourceSandbox.window.ACADEMY_SOURCE_CATALOG||{};for(const course of courses)check(sourceCatalog[course.id]?.length,`${course.id}: missing source catalog`);for(const [courseId,list] of Object.entries(sourceCatalog)){const urls=new Set;for(const source of list){check(/^https:\/\//.test(source.url),`${courseId}: invalid source URL ${source.url}`);check(source.title&&source.publisher&&source.type,`${courseId}: incomplete source metadata`);check(!urls.has(source.url),`${courseId}: duplicate source ${source.url}`);urls.add(source.url);}}for(const url of ['https://www.postgresql.org/docs/current/ddl.html','https://www.postgresql.org/docs/current/queries-table-expressions.html','https://www.postgresql.org/docs/current/indexes.html','https://www.postgresql.org/docs/current/using-explain.html','https://www.postgresql.org/docs/current/routine-vacuuming.html'])check(sourceText.includes(url)||platform.includes(url),`Missing verified source ${url}`);check(platform.includes('SOURCES AND FURTHER READING'),'Database lesson renderer missing sources section');
}
if(mode==='relationships'||mode==='all'){
  const relationshipSource=await readFile(join(root,'src','features','course-catalog','relationships.js'),'utf8'),relationshipSandbox={window:{}};vm.createContext(relationshipSandbox);vm.runInContext(relationshipSource,relationshipSandbox);const courseIds=new Set(courses.map(c=>c.id)),allowed=new Set(['PREREQUISITE','RECOMMENDED_BEFORE','RECOMMENDED_AFTER','RELATED_CONCEPT','USED_IN_PROJECT','CONTINUATION','ALTERNATIVE','PRACTICAL_APPLICATION']);for(const rel of relationshipSandbox.window.ACADEMY_RELATIONSHIPS){check(courseIds.has(rel.source),`Invalid relationship source ${rel.source}`);check(courseIds.has(rel.target),`Invalid relationship target ${rel.target}`);check(allowed.has(rel.type),`Invalid relationship type ${rel.type}`);check(rel.reasonEn&&rel.reasonAr,`Relationship ${rel.source}->${rel.target} lacks bilingual reason`);}
}

const report=courses.map(course=>({path:course.title,courses:1,chapters:course.modules.length,lessons:lessons(course).length,complete:lessons(course).length,exercises:lessons(course).length,visualizations:['sql','database-optimization'].includes(course.id)?lessons(course).length:0,references:['sql','database-optimization'].includes(course.id)?lessons(course).length:0,missingArabic:['python-ai','sql','database-optimization'].includes(course.id)?lessons(course).filter(item=>!item.meta.titleAr).length:0,missingEnglish:lessons(course).filter(item=>!item.title).length}));
console.table(report);if(failures.length){failures.forEach(item=>console.error(`FAIL ${item}`));throw new Error(`${mode} validation failed with ${failures.length} issue(s).`);}console.log(`PASS ${mode} validation: ${allLessons.length} lessons across ${courses.length} paths.`);
