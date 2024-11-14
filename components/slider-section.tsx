import User from "@/interfaces/User";
import SkillSlider from "./skill-slider";

function SkillsSection({ formData, handleSliderChange }: { formData: User, handleSliderChange: any }) {
    
    return (
      <div>
        <SkillSlider
          id="productManagement"
          label="Product Management"
          description="Leading teams, coordinating tasks, and ensuring project success"
          value={formData.role_experience.product_management}
          onValueChange={handleSliderChange("product_management")}
        />
        <SkillSlider
          id="software"
          label="Software Development"
          description="Programming, app development, and software architecture"
          value={formData.role_experience.software}
          onValueChange={handleSliderChange("software")}
        />
        <SkillSlider
          id="hardware"
          label="Hardware Development"
          description="Electronics, prototyping, and physical computing"
          value={formData.role_experience.hardware}
          onValueChange={handleSliderChange("hardware")}
        />
        <SkillSlider
          id="uiDesign"
          label="UI/UX Design"
          description="User interface design, user experience, wireframing, and prototyping"
          value={formData.role_experience.uiux_design}
          onValueChange={handleSliderChange("uiDesign")}
        />
      </div>
    );
  }
  
  export default SkillsSection;
  