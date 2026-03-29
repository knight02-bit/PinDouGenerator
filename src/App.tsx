import { useBeadStore } from './stores/beadStore';
import { MainLayout } from './components/Layout/MainLayout';
import { ImageUploader } from './components/Controls/ImageUploader';
import { SizeSelector } from './components/Controls/SizeSelector';
import { BrandSelector } from './components/Controls/BrandSelector';
import { ViewModeSelector } from './components/Controls/ViewModeSelector';
import { ExportPanel } from './components/Controls/ExportPanel';
import { PixelGrid } from './components/Canvas2D/PixelGrid';
import { BeadScene } from './components/Canvas3D/BeadScene';
import { ColorPaletteDisplay } from './components/Canvas3D/ColorPalette3D';

function App() {
  const viewMode = useBeadStore((s) => s.viewSettings.viewMode);

  return (
    <MainLayout>
      <div className="grid grid-cols-12 gap-4">
        {/* Left Panel - Controls */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <ImageUploader />
          <BrandSelector />
          <SizeSelector />
          <ViewModeSelector />
          <ExportPanel />
        </div>

        {/* Main Content - Canvas */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {viewMode === '2d' ? (
            <>
              <PixelGrid />
              <ColorPaletteDisplay />
            </>
          ) : (
            <>
              <BeadScene />
              <ColorPaletteDisplay />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
