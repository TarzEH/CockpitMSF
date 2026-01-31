# msf-ws.ru
# Metasploit data web service

require 'pathname'
@framework_path = File.expand_path(File.dirname(__FILE__))
root = Pathname.new(@framework_path).expand_path
@framework_lib_path = root.join('lib')
$LOAD_PATH << @framework_lib_path.to_path unless $LOAD_PATH.include?(@framework_lib_path)

require 'msfenv'

if ENV['MSF_LOCAL_LIB']
  $LOAD_PATH << ENV['MSF_LOCAL_LIB'] unless $LOAD_PATH.include?(ENV['MSF_LOCAL_LIB'])
end

run Msf::WebServices::MetasploitApiApp

# Warmup: ensure framework and DB are loaded before accepting requests (like msf-json-rpc.ru)
warmup do |app|
  client = Rack::MockRequest.new(app)
  response = client.get('/api/v1/msf/version')
  unless response.status == 200
    raise "Metasploit REST API did not start successfully. Status: #{response.status}, body: #{response.body}"
  end
end
