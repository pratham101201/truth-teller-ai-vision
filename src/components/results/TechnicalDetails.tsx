
import React from 'react';
import { Card } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import { AnalysisResult } from '@/types/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TechnicalDetailsProps {
  result: AnalysisResult;
  mediaFile: File;
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ result, mediaFile }) => {
  return (
    <Card className="p-4 border border-slate-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-slate-100 rounded-full">
          <FileText className="h-5 w-5 text-slate-600" />
        </div>
        <h3 className="font-medium">Technical Analysis Report</h3>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="detection">
          <AccordionTrigger className="text-sm font-medium">
            Detection Features
          </AccordionTrigger>
          <AccordionContent className="text-sm">
            <div className="space-y-2 text-slate-600">
              <p>Our analysis examined the following features:</p>
              <ul className="list-disc pl-5 space-y-1">
                {result.detectionFeatures ? (
                  result.detectionFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                ) : (
                  <>
                    <li>Facial consistency analysis</li>
                    <li>Motion and behavior patterns</li>
                    <li>Lighting and shadow consistency</li>
                    <li>Edge detection and artifact analysis</li>
                  </>
                )}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="technique">
          <AccordionTrigger className="text-sm font-medium">
            Analysis Technique
          </AccordionTrigger>
          <AccordionContent className="text-sm">
            <div className="space-y-2 text-slate-600">
              <p>
                {result.techniqueUsed || 'Our system used a combination of convolutional neural networks and forensic analysis techniques to examine this media.'}
              </p>
              <p>
                Model version: {result.modelVersion || 'TruthTeller v2.3'}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="metadata">
          <AccordionTrigger className="text-sm font-medium">
            Media Metadata
          </AccordionTrigger>
          <AccordionContent className="text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-600">
              <div>File type:</div>
              <div className="font-medium">{mediaFile.type}</div>
              
              <div>File size:</div>
              <div className="font-medium">{(mediaFile.size / (1024 * 1024)).toFixed(2)} MB</div>
              
              {result.mediaMetadata?.dimensions && (
                <>
                  <div>Dimensions:</div>
                  <div className="font-medium">
                    {result.mediaMetadata.dimensions.width} × {result.mediaMetadata.dimensions.height}
                  </div>
                </>
              )}
              
              {result.mediaMetadata?.format && (
                <>
                  <div>Format:</div>
                  <div className="font-medium">{result.mediaMetadata.format}</div>
                </>
              )}
              
              {result.mediaMetadata?.frameRate && (
                <>
                  <div>Frame rate:</div>
                  <div className="font-medium">{result.mediaMetadata.frameRate} fps</div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default TechnicalDetails;
