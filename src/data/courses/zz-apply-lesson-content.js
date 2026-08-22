(function () {
  const courses = window.ACADEMY_COURSES || {};
  const specs = window.ACADEMY_LESSON_SPECS || {};
  const {
    clean, sentence, key, conceptCatalog, defaultExamples, inferLanguage, lower
  } = window.DevPathLessonContent;

  const examplesFor = (course, title, language) => {
    const selected = specs[course.id]?.examples?.(title) ||
        defaultExamples(course, title, language);
    const marker = key(`${course.id}-${title}`);
    return selected.map(
        ([exampleTitle, explanation, code, output], index) =>
            [exampleTitle, explanation,
             `${language === 'sql' ? '--' : language === 'text' ? '#' : '//' } ${marker}-example-${index + 1}\n${code}`,
             output]);
  };

  const guidanceFor = (course, title, module, concepts) => {
    const t = lower(title), first = concepts[0].name;
    const shared = {
      realWorld: {
        context:
            `DevPath Academy uses ${title} in its ${module.title} capability.`,
        implementation: `The implementation applies ${
            first} at a named boundary, validates its inputs, records the resulting state, and exposes the outcome to the caller or operator.`,
        reasoning: `This makes the ${
            title} decision testable and keeps unrelated responsibilities outside the lesson example.`
      },
      mistakes: [
        `Ignoring the preconditions of ${first}.`,
        `Selecting a variation whose guarantees do not match the required behavior.`,
        `Testing only a successful input and missing the characteristic boundary case.`
      ],
      practices: [
        `State the ${title} contract before writing syntax.`,
        `Keep ${first} isolated enough to test with representative inputs.`,
        `Verify the observable result and measure cost when it can affect capacity.`
      ]
    };
    const rules = specs[course.id]?.guidanceRules || [];
    const match = rules.find(([pattern]) => pattern.test(t));
    if (!match) return shared;
    const [context, mistakes, practices] = match[1];
    return {
      realWorld: {
        context,
        implementation: `For ${title}, DevPath Academy implements ${
            first} using the first example as the minimal contract and the second as its verification or failure probe.`,
        reasoning: `The design matches ${
            module
                .title} while keeping the topic's data, lifecycle, security, and operational trade-offs visible.`
      },
      mistakes,
      practices
    };
  };

  Object.values(courses)
      .filter(course => course.id !== 'react' && !course.skipAutoContent)
      .forEach(course => {
        const spec = specs[course.id];
        if (!spec) return;
        course.modules.forEach(module => module.lessons.forEach(lesson => {
          lesson[2] = lesson[2] || {};
          const title = lesson[1], topic = clean(title);
          const concept = spec.concept ?
              spec.concept(title, module.title) :
              ((spec.concepts.find(([pattern]) => pattern.test(lower(title))) ||
                [])[1] ||
               `${topic} establishes a focused capability inside ${
                   module.title}`);
          const language = spec.language;
          const concepts = conceptCatalog(title, concept, course, module),
                examples =
                    examplesFor(course, title, language)
                        .map(
                            ([exampleTitle, explanation, code, output]) => ({
                              title: exampleTitle,
                              explanation: `${
                                  explanation} In this lesson, relate the result specifically to ${
                                  title}.`,
                              code,
                              output,
                              language: inferLanguage(language, code)
                            })),
                guidance = guidanceFor(course, title, module, concepts);
          lesson[2].content = {
            objectives: [
              `Describe ${
                  title} in plain language and distinguish it from neighboring topics in ${
                  module.title}.`,
              `Apply the syntax, API, query, or workflow demonstrated in both ${
                  title} examples.`,
              `Choose an appropriate ${
                  title} variation and diagnose its most likely failure mode.`
            ],
            simple: sentence(`${title} focuses on this idea: ${concept}`),
            technical: sentence(`${title} is implemented by combining ${
                concepts.map(item => item.name)
                    .join(
                        ', ')}. Its contract includes the accepted input, state or lifecycle transition, output, error behavior, and the resource or computational cost visible in ${
                spec.context}`),
            whenToUse: sentence(`Use ${
                title} when its stated guarantees match the requirement in ${
                module
                    .title}; choose a simpler neighboring technique when those guarantees, runtime costs, consistency rules, or operational responsibilities are unnecessary`),
            concepts,
            examples,
            realWorld: guidance.realWorld,
            mistakes: guidance.mistakes,
            practices: guidance.practices,
            exercise: `Extend the first ${
                title} example with a second input that exercises ${
                concepts[1]
                    .name}. Predict the result before running it, then add one assertion for a failure or boundary condition and explain why the selected variation is appropriate.`,
            questions: [
              `What exact problem does ${title} solve in ${module.title}?`,
              `Which assumption or lifecycle rule can invalidate a ${
                  title} implementation?`,
              `What output, test, plan, or metric would prove that ${
                  title} works correctly?`
            ],
            takeaways: [
              `${title} combines ${
                  concepts.map(item => item.name)
                      .join(' and ')} under one topic-specific contract.`,
              `The right variation is selected from required behavior, not from familiarity.`,
              `The two examples and a boundary test provide evidence that the implementation matches the explanation.`
            ]
          };
        }));
      });
})();
