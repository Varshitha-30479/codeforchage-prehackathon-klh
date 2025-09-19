import ScenarioTemplates from '../ScenarioTemplates';

export default function ScenarioTemplatesExample() {
  const handleSelectTemplate = (template: any) => {
    console.log('Selected template:', template.name, template.presets);
  };

  return (
    <ScenarioTemplates onSelectTemplate={handleSelectTemplate} />
  );
}