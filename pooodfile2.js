ENV['RCT_NEW_ARCH_ENABLED'] = '0'

require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '16.0'
install! 'cocoapods', :deterministic_uuids => false

prepare_react_native_project!

target 'FacePetAnalysis' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => false,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  pod 'Google-Mobile-Ads-SDK', '12.2.0'
  pod 'RNGoogleMobileAds', :path => '../node_modules/react-native-google-mobile-ads'
  pod 'RNSVG', :path => '../node_modules/react-native-svg'
  pod 'RNPermissions', :path => '../node_modules/react-native-permissions'
  pod 'RNCPicker', :path => '../node_modules/@react-native-picker/picker'
  pod 'react-native-image-picker', :path => '../node_modules/react-native-image-picker'
  pod 'BVLinearGradient', :path => '../node_modules/react-native-linear-gradient'

  post_install do |installer|
    react_native_post_install(
      installer,
      :mac_catalyst_enabled => false
    )

    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.0'
      end
    end

    # .bundle dosyalarını manuel oluştur
    installer.pods_project.targets.each do |target|
      if ['react-native-image-picker', 'boost', 'glog'].include?(target.name)
        resources_dir = "Pods/#{target.name}/Resources"
        FileUtils.mkdir_p(resources_dir)
        bundle_name = "RNImagePickerPrivacyInfo.bundle" if target.name == 'react-native-image-picker'
        bundle_name = "#{target.name}_privacy.bundle" if ['boost', 'glog'].include?(target.name)
        bundle_path = "#{resources_dir}/#{bundle_name}"
        FileUtils.mkdir_p(bundle_path)
        FileUtils.cp(
          "Pods/Target Support Files/#{target.name}/ResourceBundle-#{bundle_name}-#{target.name}-Info.plist",
          "#{bundle_path}/Info.plist",
          :verbose => true
        ) if File.exist?("Pods/Target Support Files/#{target.name}/ResourceBundle-#{bundle_name}-#{target.name}-Info.plist")
        # Dummy dosya ekle
        FileUtils.touch("#{bundle_path}/#{File.basename(bundle_name, '.bundle')}")
        File.write("#{bundle_path}/#{File.basename(bundle_name, '.bundle')}", "Placeholder")
      end
    end

    # .bundle dosyalarını derleme dizinine kopyala (tüm içerikle birlikte)
    installer.pods_project.targets.each do |target|
      target.build_phases.each do |phase|
        if phase.display_name == '[CP] Copy Pods Resources'
          phase.shell_script = <<-SCRIPT.gsub(/^ {12}/, '')
            set -ev
            export IPHONEOS_DEPLOYMENT_TARGET=16.0
            export BUILD_DIR="$PODS_BUILD_DIR"
            export PODS_ROOT="$PODS_ROOT"
            /bin/sh -c "$PODS_ROOT/Pods/Target\ Support\ Files/#{target.name}/#{target.name}-resources.sh"
            # Manuel olarak .bundle dosyalarını kopyala (tüm içerikle birlikte)
            if [ -d "$PODS_ROOT/#{target.name}/Resources" ]; then
              mkdir -p "$BUILD_DIR/#{target.name}/"
              rsync -av "$PODS_ROOT/#{target.name}/Resources/" "$BUILD_DIR/#{target.name}/"
            fi
          SCRIPT
        end
      end
    end
  end
end