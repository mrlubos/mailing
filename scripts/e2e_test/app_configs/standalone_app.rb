require_relative '../helpers/test_runner_utils'

class StandaloneApp < App
  include TestRunnerUtils

  def initialize(root_dir, *args)
    super('standalone', root_dir, *args)
  end

private
  def yarn_create!
    Dir.chdir(@root_dir) do
      system_quiet("yarn init --yes")
      system_quiet("yarn add react react-dom")
    end
  end
end